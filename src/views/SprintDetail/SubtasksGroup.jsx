import { Collapse, IconButton } from "@mui/material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import SubtaskRow from "./SubtaskRow";
import { useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../utils/applyDrag";
import sprintService from "../../services/sprintService";
import { useParams } from "react-router-dom";

const SubtasksGroup = ({
  group,
  editSubtask,
  removeSubtask,
  disableEdit,
  step,
  updateSubtask,
  disableEditStatus,
  listType,
  setSubtasksList,
  sprint,
}) => {
  const { sprintId } = useParams();

  const [subtaskListVisible, setSubtaskListVisible] = useState(true);

  const onDrop = (dropResult) => {
    const result = applyDrag(group.subtasks, dropResult);

    if (result) {
      setSubtasksList(result, step.id);
      updateSubtaskOrder(dropResult);
    }
  };

  const updateSubtaskOrder = ({ removedIndex, addedIndex }) => {
    sprintService.updateSprintSubtaskOrder(
      sprintId,
      step.id,
      group.subtasks[removedIndex].id,
      addedIndex + 1
    );
  };

  return (
    <div className="SubtasksGroup">
      {listType !== "list" && (
        <IconButton
          color="primary"
          className={`dropdown-btn ${subtaskListVisible ? "close" : ""}`}
          onClick={() => setSubtaskListVisible((prev) => !prev)}
        >
          <ExpandCircleDownIcon />
        </IconButton>
      )}
      <div className="group">
        <div className="group-row silver-bottom-border">
          <div className="group-name">
            <span className="group-name-block">{group.title}</span>
          </div>
          <div className="comments">Comments</div>
          <div className="members">Deadline</div>
          <div className="status">Status</div>
        </div>

        <Collapse in={subtaskListVisible}>
          <Container
            onDrop={onDrop}
            lockAxis="y"
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            dragHandleSelector=".drag-handler-btn"
          >
            {group.subtasks?.map((subtask, index) => (
              <Draggable key={subtask.id}>
                <SubtaskRow
                  step={step}
                  disableEdit={disableEdit}
                  key={subtask.id}
                  subtask={subtask}
                  index={index}
                  editSubtask={editSubtask}
                  removeSubtask={removeSubtask}
                  updateSubtask={updateSubtask}
                  disableEditStatus={disableEditStatus}
                  listType={listType}
                  sprint={sprint}
                />
              </Draggable>
            ))}
          </Container>
        </Collapse>
      </div>
    </div>
  );
};

export default SubtasksGroup;
