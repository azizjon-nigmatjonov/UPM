import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import ButtonsPopover from "../../../components/ButtonsPopover";
import UsersRow from "../../../components/UsersRow";
import sprintService from "../../../services/sprintService";
import subtaskService from "../../../services/subtaskService";
import SubtaskModalNew from "../Backlog/Subtask/SubtaskModalNew";
import EditCard from "./EditCard";
import { format } from "date-fns";

import NotesIcon from "@mui/icons-material/Notes";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckboxIcon from "../../../assets/icons/select.svg";

const SubtaskCard = ({
  subtask,
  getStep,
  setSubtaskList,
  step,
  removeSubtask,
  statusId,
  changeSubtaskStatus,
  onSubtaskDataChange,
}) => {
  const selectedSprintId = useSelector(
    (state) => state.sprint.selectedSprintId
  );

  const [modalVisible, setModalVisible] = useState(
    subtask.modalVisible ?? false
  );
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [loader, setLoader] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
    getStep();
  };
  const openModal = () => setModalVisible(true);

  const deleteSubtask = () => {
    setLoader(true);
    sprintService
      .removeSubtaskFromSprint(selectedSprintId, step.id, subtask.id)
      .then((res) => removeSubtask(statusId, subtask.id))
      .catch(() => setLoader(false));
  };

  const updateSubtaskStatusFromModal = (statusId) => {
    changeSubtaskStatus(statusId, subtask);
  };

  const updateSubtask = (data) => {
    setLoader(true);
    subtaskService
      .update(data)
      .then((res) => {
        setSubtaskList((prev) =>
          prev?.map((el) => (el.id !== data.id ? el : data))
        );
        setEditFormVisible(false);
      })
      .finally(() => setLoader(false));
  };

  const titleChangeHandler = (title) => {
    onSubtaskDataChange({
      ...subtask,
      subtask_title: title,
    });
  };

  const onSubmit = (data) => {
    updateSubtask(data);
  };

  if (editFormVisible)
    return <EditCard subtask={subtask} onSubmit={onSubmit} />;

  return (
    <>
      {modalVisible && (
        <SubtaskModalNew
          sprintSubtask
          closeModal={closeModal}
          subtask={subtask}
          updateStatus={updateSubtaskStatusFromModal}
          step={step}
          sprintId={selectedSprintId}
          titleChangeHandler={titleChangeHandler}
        />
      )}
      <div className="SubtaskCard card" onClick={openModal}>
        {subtask.first_file_id && (
          <div onDragStart={(e) => e.preventDefault()}>
            <img
              className="attached-image"
              src={`${process.env.REACT_APP_CDN_API_URL}/file/${subtask.first_file_id}`}
              alt="subtask-img"
            />
          </div>
        )}

        <div className="main">
          <div className="parents-row">
            <div className="parents-block task">{subtask.task_title}</div>
            <ArrowForwardIosIcon
              sx={{ color: "#6E8BB7", fontSize: 14, marginRight: "2px" }}
            />
            <div className="parents-block stage"> {subtask.stage_title}</div>
          </div>

          <p className="subtask-title text">{subtask.subtask_title}</p>

          <div className="card-footer">
            {subtask.due_date && (
              <div className="date-block">
                <AccessTimeIcon />
                <p className="label">
                  {format(new Date(subtask.due_date), "MMM d")}
                </p>
              </div>
            )}

            {subtask.description && (
              <div className="description">
                <NotesIcon sx={{ color: "#6F7B8F", marginBottom: "-4px" }} />
              </div>
            )}

            {subtask.files_count && (
              <div className="attach">
                <AttachFileIcon className="img" sx={{ color: "#6F7B8F" }} />
                <span>{subtask.files_count}</span>
              </div>
            )}

            {subtask.count_all && (
              <div className="task-progress">
                <img src={CheckboxIcon} alt="checkbox-icon" />
                <span>
                  {(subtask.count_done ?? 0) + "/" + subtask.count_all}
                </span>
              </div>
            )}
            <div className="id">{subtask.number && `#${subtask.number}`}</div>
          </div>

          {subtask.assignee_user_ids && (
            <div className="assignee">
              <UsersRow size="small" assigneeUsers={subtask.assignee_users} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubtaskCard;
