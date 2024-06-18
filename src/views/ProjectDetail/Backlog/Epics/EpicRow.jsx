import {
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
// import ButtonsPopover from "../../../../components/ButtonsPopover"
import CreateRow from "../CreateRow";
import RowLinearLoader from "../../../../components/RowLinearLoader";
import TaskRow from "../Task/TaskRow";
import CreateRowButton from "../../../../components/CreateRowButton";
import { useParams } from "react-router-dom";
import TasksCounter from "../../../../components/TasksCounter";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../../utils/applyDrag";
import { useDispatch, useSelector } from "react-redux";
import CollapseFolderIcons from "../../../../components/CollapseIcon/CollapseFolderIcons";
import {
  deleteEpicAction,
  updateEpicAction,
} from "../../../../redux/thunks/epic.thunk";
import {
  createNewTaskAction,
  getTaskListInsideEpicAction,
  updateTaskOrderAction,
} from "../../../../redux/thunks/task.thunk";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useMemo } from "react";
import { epicActions } from "../../../../redux/slices/epic.slice";
import { updateGanttPositionsAction } from "../../../../redux/thunks/subtask.thunk";
import TaskCreateRow from "../Task/TaskCreateRow";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import {
  EpicEditIcon,
  EpicDeleteIcon,
  WarningIcon,
  FolderIcon,
  EpicArrow,
  FolderIconBlue,
  CalendarIcon,
  EpicCloseBtn,
} from "../../../../assets/icons/icons.js";
import "react-calendar/dist/Calendar.css";
import Modal from "@mui/material/Modal";
import CustomModal from "../../../../components/Modal";
import CloseIcon from "@mui/icons-material/Close";
import EpicRowDialog from "./EpicRowDialog";
import FTextField from "../../../../components/FormElements/FTextField";
import { ExpandMore } from "@mui/icons-material";
import OutsideClickHandler from "react-outside-click-handler";
import Calendar from "react-calendar";
import * as Yup from "yup";
import { format } from "date-fns/esm";
import { differenceInDays, differenceInMonths } from "date-fns";

const EpicsRow = ({ epic, disableEdit, insideGantt, insideBacklog }) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const openedEpics = useSelector((state) => state.epic.openedEpics);
  const allTaskList = useSelector((state) => state.task.list);
  const stagesList = useSelector((state) => state.projectStage.list);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [textFieldVisible, setTextFieldVisible] = useState(false);
  const [linearLoader, setLinearLoader] = useState(false);
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [createLoader, setCreateLoader] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openStageList, setOpenStageList] = useState(false);
  const [checkedStages, setCheckedStages] = useState([]);
  const [openCalendar, setOpenCalendar] = useState("");

  const formik = useFormik({
    initialValues: {
      color: epic?.color || "#1ABC9C",
      start_date: {
        expected: new Date(epic.start_date.expected) || undefined,
        fact: new Date(epic.start_date.fact),
      },
      end_date: {
        expected: new Date(epic.end_date.expected) || undefined,
        fact: new Date(epic.end_date.fact),
      },
      locked: -1,
      status_id: epic?.status_id || "",
    },
  });

  const validationSchema = Yup.object().shape({
    start_date: Yup.object().shape({
      expected: Yup.date().required("Required"),
    }),
    end_date: Yup.object().shape({
      expected: Yup.date().required("Required"),
    }),
  });

  const taskFormik = useFormik({
    initialValues: {
      title: "",
      stages: [],
      start_date: {
        expected: "",
      },
      end_date: {
        expected: "",
      },
    },
    validationSchema,
    onSubmit: (values) => {
      const selectedStages = stagesList.filter((stage) =>
        checkedStages.includes(stage.id)
      );
      createTask({
        ...values,
        stages: selectedStages,
      });
    },
  });

  const openConfirm = () => setOpenConfirmModal(true);
  const closeConfirm = () => setOpenConfirmModal(false);

  const childBlockVisible = useMemo(() => {
    return openedEpics.includes(epic.id);
  }, [openedEpics, epic.id]);

  const taskList = useMemo(() => {
    return allTaskList.filter((task) => task.epic_id === epic.id) ?? [];
  }, [allTaskList, epic]);

  // ----------EPIC ACTIONS----------------

  const deleteHandler = () => {
    setLoader(true);
    dispatch(deleteEpicAction(epic.id)).then(() => setLoader(false));
  };

  const updateHandler = ({
    title,
    locked = -1,
    color,
    start_date,
    end_date,
    status_id,
  }) => {
    const data = {
      ...epic,
      title,
      locked,
      color,
      status_id,
      start_date,
      end_date,
    };

    setCreateLoader(true);
    dispatch(updateEpicAction(data))
      .unwrap()
      .then(() => setTextFieldVisible(false))
      .finally(() => {
        setCreateLoader(false);
      });
  };

  // --------TASK LIST ACTIONS---------------------

  const openChildBlock = () => {
    if (taskList?.length) return dispatch(epicActions.addOpenedEpic(epic.id));
    getTaskList();
  };

  const switchChildBlockVisible = () => {
    if (!childBlockVisible) return openChildBlock();
    dispatch(epicActions.removeOpenedEpic(epic.id));
  };

  const getTaskList = () => {
    setLinearLoader(true);
    dispatch(getTaskListInsideEpicAction(epic.id))
      .unwrap()
      .then((res) => {
        if(res.length){
          if (insideGantt) dispatch(updateGanttPositionsAction());
          dispatch(epicActions.addOpenedEpic(epic.id));
        }
      })
      .finally(() => {
        setLinearLoader(false);
      });
  };

  const createTask = (values) => {
    const data = {
      epic_id: epic.id,
      project_id: projectId,
      ...values,
    };
    setCreateLoader(true);
    dispatch(createNewTaskAction({ data, haveList: taskList.length }))
      .unwrap()
      .then((res) => {
        setCreateFormVisible(false);
        setOpenForm(false);
        setCheckedStages([]);
        taskFormik.resetForm();
        dispatch(epicActions.addOpenedEpic(epic.id));
      })
      .catch(() => setCreateLoader(false));
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(taskList, dropResult);
    if (result) {
      dispatch(
        updateTaskOrderAction({
          ...dropResult,
          list: result,
          id: taskList[dropResult.removedIndex].id,
        })
      );
    }
  };
  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setTextFieldVisible(false);
  };
  const confirmDelete = (e) => {
    e.stopPropagation();
    deleteHandler();
    closeConfirm();
    setLoader(false);
  };
  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirm(false);
    closeConfirm();
    setLoader(false);
  };

  const hexRgba = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  let date_1 = new Date(epic?.end_date?.expected);
  let date_2 = new Date(epic?.end_date?.fact);

  const days = (date_1, date_2) => {
    let TotalDays = differenceInDays(new Date(date_1), new Date(date_2));
    let month = 0;
    let weeks = 0;
    let days = 0;

    if (TotalDays > -7) {
      return TotalDays + "d";
    } else if (TotalDays <= -7 && TotalDays > -30) {
      weeks = (TotalDays / 7).toFixed(0);
      days = TotalDays % 7;
      return weeks + "w " + (days < 0 ? days * -1 + "d " : "");
    } else if (TotalDays <= -30 && TotalDays > -365) {
      month = differenceInMonths(new Date(date_1), new Date(date_2));
      if (TotalDays % 30 <= -7 && TotalDays % 30 > -30) {
        weeks = ((TotalDays % 30) / 7).toFixed(0);
        days = (TotalDays % 30) % 7;
        return (
          month +
          "m " +
          (weeks < 0 ? weeks * -1 + "w " : "") +
          (days < 0 ? days * -1 + "d " : "")
        );
      } else if (TotalDays % 30 > -7) {
        days = TotalDays % 30;
        return month + "m" + (days < 0 ? days * -1 + "d " : "");
      }
      return month + "m";
    }

    return TotalDays;
  };

  const onChecked = (val, id) => {
    if (val) setCheckedStages((prev) => [...prev, id]);
    else setCheckedStages((prev) => prev.filter((el) => el !== id));
  };

  return (
    <>
      <MenuItem
        className={`EpicRow silver-bottom-border pointer ${insideGantt ? "drag-handler-btn" : ""}`}
        onClick={switchChildBlockVisible}
        style={{
          backgroundColor:
            hexRgba(formik.values.color) !== null
              ? `rgba(${hexRgba(formik.values.color).r}, ${
                  hexRgba(formik.values.color).g
                }, ${hexRgba(formik.values.color).b}, 0.15)`
              : "#fff",
          
        }}
      >
        <>
        <div className="space-right" >
          <CollapseFolderIcons
            fill={formik.values.color}
            isOpen={childBlockVisible}
            />
            </div>
          {!insideGantt && <IconButton className="drag-icon drag-handler-btn" color="primary">
            <DragIndicatorIcon />
          </IconButton>}
          <div className="label">
            {epic.title}
            
            <span
              className="day_diff"
              style={{
                color: days(date_1, date_2) > 0 ? "#4094F7" : "#F76659",
              }}
            >

              {days(date_1, date_2) || null}
            </span>
          </div>

          <div className="btns">
            <span
              className="project_percent space-right"
              style={{
                background:
                  epic?.percent === 0 || epic?.percent <= 25
                    ? "#F76659"
                    : epic?.percent <= 50
                    ? "#F8DD4E"
                    : epic?.percent <= 75
                    ? "#4094F7"
                    : epic?.percent <= 100
                    ? "#1AC19D"
                    : "#F76659",
                color: "#fff",
              }}
            >
              {epic?.percent ? epic?.percent : 0}%
            </span>
            <TasksCounter element={epic} />
            {(!disableEdit && !insideGantt) && (
              <CreateRowButton
                formVisible={openForm}
                setFunction={setOpenForm}
              />
            )}
            {(!disableEdit) && (
              <button className="epic_btn" onClick={handleClick}>
                <EpicEditIcon />
              </button>
            )}
            {(!disableEdit && !insideGantt) && (
              <button
                className="epic_delete_btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openConfirm();
                }}
              >
                <EpicDeleteIcon />
              </button>
            )}

            {loader ? (
              <div style={{ padding: "12px" }}>
                <CircularProgress disableShrink size={20} />
              </div>
            ) : (
              <>
                {/* {!disableEdit && (
                    <ButtonsPopover
                      onDeleteClick={deleteHandler}
                      onEditClick={() => setTextFieldVisible(true)}
                    />
                  )} */}
              </>
            )}
          </div>
        </>
        {textFieldVisible ? (
          <CreateRow
            initialTitle={epic.title}
            onSubmit={updateHandler}
            btnLoader={createLoader}
          />
        ) : (
          ""
        )}

        <RowLinearLoader visible={linearLoader} />
      </MenuItem>
      <CustomModal
        open={openForm}
        setOpen={() => {
          setOpenForm(false);
          setCheckedStages([]);
          taskFormik.resetForm();
        }}
        headerStyle={{
          padding: "8px 16px",
          backgroundColor: "#F6F8F9",
          borderRadius: "8px 8px 0 0",
        }}
        bodyStyle={{}}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
                color: "#6E7C87",
                fontSize: "14px",
              }}
            >
              <FolderIcon /> <span>Projects</span> <EpicArrow />
              <FolderIcon /> <span>Project info</span> <EpicArrow />
              <FolderIconBlue />
              <span style={{ color: "#252C32" }}>{epic.title}</span>
            </div>
            <button
              className="close_btn"
              onClick={() => {
                setOpenForm(false);
                setCheckedStages([]);
                taskFormik.resetForm();
              }}
            >
              <EpicCloseBtn />
            </button>
          </div>
        }
        footer={
          <button
            className="customBtn"
            onClick={() => {
              taskFormik.handleSubmit();
            }}
          >
            Create
          </button>
        }
        footerStyle={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px",
        }}
      >
        <div className="customModalBody">
          <div className="body_top">
            <FTextField
              onClick={(e) => e.stopPropagation()}
              formik={taskFormik}
              name="title"
              disabledHelperText
              placeholder="Task title"
            />
            <div
              className="customStages"
              onClick={() => setOpenStageList(true)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>Select Stages</span>{" "}
                <ExpandMore sx={{ color: "#0E73F6" }} />
              </div>
              {openStageList && (
                <OutsideClickHandler
                  onOutsideClick={() => {
                    setOpenStageList(false);
                  }}
                >
                  <div className="customStagedList">
                    {stagesList?.map((stage) => (
                      <div key={stage.id} className="stagedItem">
                        <p className="label">{stage.title}</p>
                        <Checkbox
                          checked={checkedStages.includes(stage.id)}
                          onChange={(_, val) => onChecked(val, stage.id)}
                        />
                      </div>
                    ))}
                  </div>
                </OutsideClickHandler>
              )}
            </div>
          </div>
          <Divider />
          <div className="body_bottom">
            {/* Planned */}
            <div className="dateItem">
              <div className="label">Planned</div>
              <div
                className="dateArea"
                onClick={() =>
                  setOpenCalendar((prev) =>
                    prev === "planned" ? "" : "planned"
                  )
                }
              >
                <span>
                  {taskFormik?.values?.start_date?.expected
                    ? format(
                        taskFormik?.values?.start_date?.expected,
                        "dd-MM-yyyy"
                      )
                    : "-"}
                </span>
                <CalendarIcon
                  color={
                    taskFormik?.errors?.start_date?.expected &&
                    taskFormik.submitCount > 0
                      ? "#F76659"
                      : "#0E73F6"
                  }
                />
              </div>
              {openCalendar === "planned" && (
                <div className="dateCalendar">
                  <Calendar
                    value={taskFormik.values.start_date.expected}
                    name="start_date"
                    onChange={(e) => {
                      taskFormik.setFieldValue("start_date.expected", e);
                      setOpenCalendar("");
                    }}
                  />
                </div>
              )}
            </div>
            {/* Due date */}
            <div className="dateItem">
              <div className="label">Due date</div>
              <div
                className="dateArea"
                onClick={() =>
                  setOpenCalendar((prev) => (prev === "due" ? "" : "due"))
                }
              >
                <span>
                  {taskFormik?.values?.end_date?.expected
                    ? format(
                        taskFormik?.values?.end_date?.expected,
                        "dd-MM-yyyy"
                      )
                    : "-"}
                </span>
                <CalendarIcon
                  color={
                    taskFormik?.errors?.end_date?.expected &&
                    taskFormik.submitCount > 0
                      ? "#F76659"
                      : "#0E73F6"
                  }
                />
              </div>
              {openCalendar === "due" && (
                <div className="dateCalendar">
                  <Calendar
                    value={taskFormik.values.end_date.expected}
                    name="start_date"
                    onChange={(e) => {
                      taskFormik.setFieldValue("end_date.expected", e);
                      setOpenCalendar("");
                    }}
                  />
                </div>
              )}
            </div>
            {/* Started */}
            <div className="dateItem">
              <div className="label">Started</div>
              <div className="dateArea">
                <span>
                  {taskFormik?.values?.start_date?.fact
                    ? format(taskFormik?.values?.start_date?.fact, "dd-MM-yyyy")
                    : "-"}
                </span>
              </div>
            </div>
            {/* Finished */}
            <div className="dateItem">
              <div className="label">Finished</div>
              <div className="dateArea">
                <span>
                  {taskFormik?.values?.end_date?.fact
                    ? format(taskFormik?.values?.end_date?.fact, "dd-MM-yyyy")
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
      <Modal open={openConfirmModal} onClose={closeConfirm}>
        <div className="confirm_modal">
          <div className="confirm_warning">
            <WarningIcon />
          </div>
          <div className="confirm_modal_item">
            <div className="confirm_context">
              <h2>Вы уверены, что хотите удалить?</h2>
              <span onClick={cancelDelete}>
                <CloseIcon style={{ color: "#002266" }} />
              </span>
            </div>
            <div className="btns">
              <button className="btn_not_Confirm" onClick={cancelDelete}>
                Нет
              </button>
              <button className="btn_confirm" onClick={confirmDelete}>
                Да
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Dialog open={open} onClose={handleClose}>
        <EpicRowDialog
          formik={formik}
          epic={epic}
          handleClose={handleClose}
          deleteHandler={deleteHandler}
          updateHandler={updateHandler}
        />
      </Dialog>

      <Collapse
        timeout={300}
        in={createFormVisible}
        unmountOnExit={true}
        className="silver-bottom-border"
      >
        <TaskCreateRow
          onSubmit={createTask}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
          placeholder="Task title"
        />
      </Collapse>

      <Collapse in={!textFieldVisible && childBlockVisible} unmountOnExit>
        <Container
          onDrop={onDrop}
          lockAxis="y"
          dragHandleSelector=".drag-handler-btn"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {taskList?.map((task, index) => (
            <Draggable key={task.id}>
              <TaskRow
                key={task.id}
                task={task}
                index={index}
                epicTitle={epic.title}
                // setTaskList={setTaskList}
                disableEdit={disableEdit}
                insideGantt={insideGantt}
                insideBacklog={insideBacklog}
              />
            </Draggable>
          ))}
        </Container>
      </Collapse>
    </>
  );
};

export default EpicsRow;
