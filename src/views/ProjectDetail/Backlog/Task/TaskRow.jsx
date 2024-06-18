import {
  Checkbox,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
  Modal,
} from "@mui/material"
import { useState } from "react"
import CreateRow from "../CreateRow"
import CreateRowButton from "../../../../components/CreateRowButton"
import TasksCounter from "../../../../components/TasksCounter"
import { Container, Draggable } from "react-smooth-dnd"
import { applyDrag } from "../../../../utils/applyDrag"
import { useDispatch, useSelector } from "react-redux"
import {
  deleteTaskAction,
  updateTaskAction,
} from "../../../../redux/thunks/task.thunk"
import { useMemo } from "react"
import "./style.scss"
import FormatListNumbered from "@mui/icons-material/FormatListNumbered"
import StageRow from "../Stage/StageRow"
import {
  createNewStageAction,
  updateStageOrderAction,
} from "../../../../redux/thunks/stage.thunk"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { taskActions } from "../../../../redux/slices/task.slice"
import { subtaskActions } from "../../../../redux/slices/subtask.slice"
import CloseIcon from "@mui/icons-material/Close"
import {
  EpicDeleteIcon,
  EpicEditIcon,
  WarningIcon,
} from "../../../../assets/icons/icons"
import TaskCreateRowV2 from "./TaskCreateRowV2"

const EpicsRow = ({ task, epicTitle, index, disableEdit, insideGantt, insideBacklog }) => {
  const dispatch = useDispatch()

  const openedTasks = useSelector((state) => state.task.openedTasks)
  const allStageList = useSelector((state) => state.stage.list)
  const allSubtaskList = useSelector((state) => state.subtask.list)
  const [openForm, setOpenForm] = useState(false)
  const selectedSubtasks = useSelector(
    (state) => state.subtask.selectedSubtasks
  )

  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const childBlockVisible = useMemo(() => {
    return openedTasks.includes(task.id)
  }, [openedTasks, task.id])

  const stageList = useMemo(() => {
    return allStageList.filter((stage) => stage.task_id === task.id) ?? []
  }, [allStageList, task])

  const subtaskList = useMemo(() => {
    return allSubtaskList.filter((subtask) => subtask.task_id === task.id) ?? []
  }, [allSubtaskList, task.id])

  const isChecked = useMemo(() => {
    return (
      subtaskList?.length &&
      !subtaskList.some((el) => !selectedSubtasks.includes(el.id))
    )
  }, [subtaskList, selectedSubtasks])

  // ----------TASK ACTIONS----------------

  const deleteHandler = () => {
    setLoader(true)
    dispatch(deleteTaskAction(task.id)).then(() => setLoader(false))
  }

  const updateHandler = (values) => {
    const data = {
      ...values,
    }

    setCreateLoader(true)
    dispatch(updateTaskAction(data))
      .unwrap()
      .finally(() => setCreateLoader(false))
  }

  // --------TASK STAGE ACTIONS---------------------

  const switchChildBlockVisible = () => {
    if (childBlockVisible)
      return dispatch(taskActions.removeOpenedTask(task.id))
    dispatch(taskActions.addOpenedTask(task.id))
  }

  const createStage = ({ title }) => {
    const data = {
      task_id: task.id,
      title,
    }
    setCreateLoader(true)
    dispatch(createNewStageAction(data))
      .unwrap()
      .then((res) => {
        setCreateFormVisible(false)
        dispatch(taskActions.addOpenedTask(task.id))
      })
      .catch(() => setCreateLoader(false))
  }

  const onDrop = (dropResult) => {
    const result = applyDrag(stageList, dropResult)
    if (result) {
      dispatch(
        updateStageOrderAction({
          ...dropResult,
          list: result,
          id: stageList[dropResult.removedIndex].id,
          taskId: task.id,
        })
      )
    }
  }

  const onCheckboxChange = (_, val) => {
    if (val)
      dispatch(
        subtaskActions.addSelectedSubtasks(subtaskList?.map((el) => el.id))
      )
    else
      dispatch(
        subtaskActions.removeSelectedSubtasks(subtaskList?.map((el) => el.id))
      )
  }

  const openConfirm = () => setOpenConfirmModal(true)
  const closeConfirm = () => setOpenConfirmModal(false)

  return (
    <>
      <MenuItem
        className={`TaskRow silver-bottom-border pointer drag-handler-btn ${insideGantt ? "drag-handler-btn" : ""}`}
        onClick={switchChildBlockVisible}
      >
        {textFieldVisible ? (
          // <CreateRow
          //   initialTitle={task.title}
          //   onSubmit={updateHandler}
          //   btnLoader={createLoader}
          // />
          <TaskCreateRowV2
            task={task}
            epicTitle={epicTitle}
            openForm={openForm}
            onSubmit={updateHandler}
            setOpenForm={setOpenForm}
            setTextFieldVisible={setTextFieldVisible}
          />
        ) : (
          <>
            <Checkbox
              checked={isChecked}
              onChange={onCheckboxChange}
              onClick={(e) => e.stopPropagation()}
            />
            <FormatListNumbered className="icon space-right"  />
            {!insideGantt && <IconButton className="icon drag-handler-btn">
              <DragIndicatorIcon />
            </IconButton>}
            <div
              className="label"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {task.title}
            </div>

            <div className="btns">
            <div
                className="project_percent space-right"
                style={{
                  background:
                    task?.percent < 80 || task?.percent === undefined
                      ? "#F8DD4E"
                      : "#1AC19D",
                  color:
                    task?.percent < 80 || task?.percent === undefined
                      ? "#000"
                      : "#fff",
                }}
              >
                {task.percent || 0}%
              </div>
              <TasksCounter element={task} />
              {(!disableEdit && !insideGantt) && (
                <CreateRowButton
                  formVisible={createFormVisible}
                  setFunction={setCreateFormVisible}
                />
              )}
              {(!disableEdit) && (
                <button
                  className="epic_btn"
                  onClick={() => {
                    setTextFieldVisible(true)
                    setOpenForm(true)
                  }}
                >
                  <EpicEditIcon />
                </button>
              )}
              {(!disableEdit && !insideGantt) && (
                <button
                  className="epic_delete_btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    openConfirm()
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
        )}
      </MenuItem>
      <Modal open={openConfirmModal} onClose={closeConfirm}>
        <div className="confirm_modal">
          <div className="confirm_warning">
            <WarningIcon />
          </div>
          <div className="confirm_modal_item">
            <div className="confirm_context">
              <h2>Вы уверены, что хотите удалить?</h2>
              <span
                onClick={() => {
                  closeConfirm()
                }}
              >
                <CloseIcon style={{ color: "#002266" }} />
              </span>
            </div>
            <div className="btns">
              <button className="btn_not_Confirm" onClick={closeConfirm}>
                Нет
              </button>
              <button
                className="btn_confirm"
                onClick={() => {
                  deleteHandler()
                  closeConfirm()
                }}
              >
                Да
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Collapse
        in={createFormVisible}
        className="silver-bottom-border"
        unmountOnExit
      >
        <CreateRow
          onSubmit={createStage}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
          placeholder="Task title"
        />
      </Collapse>

      <Collapse in={childBlockVisible && !textFieldVisible} unmountOnExit>
        <Container
          onDrop={onDrop}
          lockAxis="y"
          dragHandleSelector=".drag-handler-btn"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {stageList?.map((stage, index) => (
            <Draggable key={stage.id}>
              <StageRow
                key={stage.id}
                stage={stage}
                index={index}
                disableEdit={disableEdit}
                taskTitle={task.title}
                insideGantt={insideGantt}
              />
            </Draggable>
          ))}
        </Container>
      </Collapse>
    </>
  )
}

export default EpicsRow
