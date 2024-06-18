import { useMemo, useState } from "react";
import StatusSelect from "../../components/StatusSelect";
import { IconButton, MenuItem, TextField } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CBreadcrumbs from "../../components/CBreadcrumbs";
import SubtaskModal from "../ProjectDetail/Backlog/Subtask/SubtaskModal";
import sprintService from "../../services/sprintService";
import { useSelector } from "react-redux";
import SubtaskCommentModal from "../../components/SubtaskCommentModal";
import { useParams } from "react-router-dom";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import {
  MobileDatePicker,
  MobileTimePicker,
  LocalizationProvider,
} from "@mui/lab";
import { isValid } from "date-fns";
import useDebounce from "../../hooks/useDebounce";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { enGB } from "date-fns/locale";
import "./style.scss";
import { CalendarIcon } from "../../assets/icons/icons.js";
import { WatchIcon } from "../../assets/icons/icons.js";

const SubtaskRow = ({
  subtask,
  removeSubtask,
  disableEdit,
  step,
  updateSubtask,
  disableEditStatus,
  listType,
  sprint,
  index,
}) => {
  const { sprintId } = useParams();
  const projectStatusList = useSelector((state) => state.status.list);
  const taskTypeList = useSelector((state) => state.taskType.list);

  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedModalStatus, setSelectedModalStatus] = useState(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [deadLine, setDeadline] = useState(subtask?.due_date ?? null);
  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const breadCrumbItems = [
    { label: subtask?.task_title },
    { label: subtask?.stage_title },
  ];
  const closeModal = () => {
    setSelectedModalStatus(false);
  };

  const selectedType = useMemo(() => {
    const selectedStatus = projectStatusList.find(
      (el) => el.id === subtask.status_id
    );
    const selectedType = taskTypeList.find(
      (type) => type.id === selectedStatus?.project_task_type_id
    );
    return selectedType?.id;
  }, [subtask.status_id, projectStatusList, taskTypeList]);

  const updateStatus = (val, comment) => {
    const selectedStatus = projectStatusList.find((el) => el.id === val);

    if (!selectedModalStatus && selectedStatus?.state < 0)
      return setSelectedModalStatus(val);

    const data = {
      project_sprint_step_id: step.project_sprint_step_id,
      sprint_id: sprintId,
      status_id: val,
      subtask_id: subtask.subtask_id,
      subtask_item_id: subtask.id,
      task_id: subtask.task_id,
      stage_id: subtask.stage_id,
      comment,
    };

    setModalLoader(true);
    sprintService
      .updateSprintSubtaskStatus(data)
      .then((res) => {
        updateSubtask(
          {
            ...subtask,
            status_id: val,
            comment,
          },
          step.id
        );
        closeModal();
      })
      .finally(() => setModalLoader(false));
  };

  const deleteSubtask = () => {
    setLoader(true);
    sprintService
      .removeSubtaskFromSprint(sprintId, step.id, subtask.id)
      .then((res) => {
        removeSubtask(subtask.id);
      })
      .finally(() => setLoader(false));
  };

  const editStatusInModal = (val, comment) => {
    updateSubtask(
      {
        ...subtask,
        status_id: val,
        comment,
      },
      step.id
    );
  };

  const editTitleInModal = (title) => {
    updateSubtask(
      {
        ...subtask,
        subtask_title: title,
      },
      step.id
    );
  };

  const deadlineChangeHandler = (val) => {
    updateDeadline(val);
  };

  const deadlineInputHandler = (val) => {
    setDeadline(val);
    updateSubtask(
      {
        ...subtask,
        due_date: val,
      },
      step.id
    );
    if (isValid(val)) return null;
    updateDeadline(val);
  };

  const updateDeadline = useDebounce((val) => {
    sprintService.updateSprintSubtaskDeadline(subtask.id, {
      due_date: val,
      project_sprint_step_id: step.project_sprint_step_id,
    });
  }, 700);

  const disableWeekends = (date) => {
    return date.getDay() === 0;
  };
  return (
    <>
      {selectedModalStatus && (
        <SubtaskCommentModal
          closeModal={closeModal}
          updateStatus={updateStatus}
          selectedStatus={selectedModalStatus}
          loading={modalLoader}
        />
      )}

      {modalVisible && (
        <SubtaskModal
          closeModal={() => setModalVisible(false)}
          subtask={subtask}
          updateStatus={editStatusInModal}
          sprintSubtask
          disabled={disableEditStatus}
          step={step}
          sprintId={sprintId}
          titleChangeHandler={editTitleInModal}
        />
      )}

      <MenuItem
        onClick={() => setModalVisible(true)}
        className="SprintSubtaskRow pointer silver-bottom-border sprintSubtask"
      >
        <div className="subtask">
          {listType === "list" && !disableEdit && (
            <IconButton color="primary" className="drag-handler-btn">
              <DragIndicatorIcon />
            </IconButton>
          )}

          <div className="index-block">{index + 1}</div>

          <div className="info">
            <CBreadcrumbs items={breadCrumbItems} size="small" />
            <div className="subtask-title">{subtask?.subtask_title}</div>
          </div>
        </div>
        <div className="comments">{subtask?.comment}</div>
        <div className="members" onClick={(e) => e.stopPropagation()}>
          <LocalizationProvider locale={enGB} dateAdapter={AdapterDateFns}>
            <div className="date_picker">
              <MobileDatePicker
                open={open}
                label="Date"
                inputFormat="dd/MM/yyyy"
                shouldDisableDate={disableWeekends}
                value={deadLine}
                onChange={deadlineInputHandler}
                onAccept={deadlineChangeHandler}
                onClose={() => setOpen(false)}
                clearable={true}
                minDate={new Date(sprint.from_date)}
                maxDate={new Date(sprint.to_date)}
                renderInput={(params) => (
                  <TextField
                    onClick={() => setOpen(true)}
                    {...params}
                    style={{ marginRight: "10px", width: 185 }}
                  />
                )}
              />
              <button
                onClick={() => setOpen(true)}
                className="date_picker_calendar"
              >
                <CalendarIcon />
              </button>
            </div>
          </LocalizationProvider>
          <div className="time_picker">
            <MobileTimePicker
              open={timeOpen}
              label="Time"
              value={deadLine}
              onClose={() => setTimeOpen(false)}
              onChange={deadlineInputHandler}
              onAccept={deadlineChangeHandler}
              minDate={new Date(sprint.from_date)}
              maxDate={new Date(sprint.to_date)}
              ampm={false}
              inputFormat="HH:mm"
              renderInput={(params) => (
                <TextField
                  onClick={() => setTimeOpen(true)}
                  {...params}
                  style={{ width: 185 }}
                />
              )}
            />
            <button
              onClick={() => setTimeOpen(true)}
              className="time_picker_btn"
            >
              <WatchIcon />
            </button>
          </div>

          {/* <UsersRow assigneeUsers={subtask.assignee_users} /> */}
        </div>
        <div className="status">
          <StatusSelect
            typeId={selectedType}
            status={subtask.status_id}
            setStatus={updateStatus}
            disabled={disableEditStatus}
          />
        </div>
        <div>
          {!disableEdit && (
            <RectangleIconButton
              loader={loader}
              color="error"
              onClick={deleteSubtask}
            >
              <Delete color="error" />
            </RectangleIconButton>
          )}

          {/* {loader ? (
            <CircularProgress size={16} />
          ) : !disableEdit ? (
            <ButtonsPopover
              onDeleteClick={deleteSubtask}
              // onEditClick={() => setTextFieldVisible(true)}
            />
          ) : (
            <></>
          )} */}
        </div>
      </MenuItem>
    </>
  );
};

export default SubtaskRow;
