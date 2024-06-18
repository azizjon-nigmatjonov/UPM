import "./style.scss";
import React from "react";
import SButton from "../SButton";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import subtaskCopyServices from "../../../services/subtaskCopyServices";
import sprintService from "../../../services/sprintService";
import { taskTypeActions } from "../../../redux/slices/taskType.slice";
import { useDispatch, useSelector } from "react-redux";

export default function SubtaskModalActions({
  actions,
  setActions,
  subtask,
  sprintId,
  step,
  closeModal
}) {
  const dispatch = useDispatch()
  const isAddMemberMenuOpen = useSelector((state) => state.taskType.isAddMemberMenuOpen);
  const isCheckListMenuOpen = useSelector((state) => state.taskType.isCheckListMenuOpen);
  const onAdd = (name) => {
    console.log(name);
    setActions({ ...actions, [name]: !actions[name] });
  };

  const handleCopySubtask = () => {
    subtaskCopyServices
      .post(subtask.subtask_id)
      .then((res) => {
        sprintService.addMultipleSubtaskToSprint({
          sprint_id: sprintId,
          subtask_ids: [res.id],
        });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteSubtask = () => {
    sprintService
      .removeSubtaskFromSprint(sprintId, step.id, subtask.id)
      .catch((err) => console.log(err))
      .finally(() => closeModal());
  };

  return (
    <div className="SubtaskActions">
      <h3 className="label">Actions</h3>
      <div className="actions">
        {/* {!actions.members && ( */}
          <SButton
            onClick={() => {
              dispatch(taskTypeActions.setIsAddMemberMenuOpen(!isAddMemberMenuOpen))
              onAdd("members")
            }}
            title={"Members"}
            icon={<PermIdentityOutlinedIcon />}
          />
        {/* )} */}
        {/* {!actions.checklist && ( */}
          <SButton
            onClick={() => {
              dispatch(taskTypeActions.setIsCheckListMenuOpen(!isCheckListMenuOpen))
              onAdd("checklist")
            }}
            title={"Checklist"}
            icon={<CheckBoxOutlinedIcon />}
          />
        {/* )} */}
        {!actions.files && (
          <SButton
            onClick={() => onAdd("files")}
            title="Attachments"
            icon={<AttachmentOutlinedIcon />}
          />
        )}
        <SButton
          title="Copy"
          icon={<FileCopyOutlinedIcon />}
          onClick={() => handleCopySubtask()}
        />
        <SButton
          title="Delete"
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => handleDeleteSubtask()}
        />
      </div>
    </div>
  );
}
