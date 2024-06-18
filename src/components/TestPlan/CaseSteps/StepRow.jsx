import React, { useEffect, useState } from "react";
import "./style.scss";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { ClickAwayListener } from "@mui/material";

export default function StepRow({
  step,
  order,
  isDraggable = false,
  actionResult = false,
  onUpdate = () => {},
  onDelete = () => {},
  hasActions = true,
  noPadding = false,
  step_title,
}) {
  
  const [isHovering, setIsHovering] = useState(false);
  const [status, setStatus] = useState(
    step.action_id === "d5bdf861-553d-4477-9577-92b80b75a9e5"
  );
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(step_title);

  let action_id = !status
    ? "d5bdf861-553d-4477-9577-92b80b75a9e5"
    : "816d6ff3-ebbe-4027-a919-3ee75a2c219e";

  const statusChange = () => {
    setStatus(!status);
    onUpdate(step.id, step_title, action_id);
  };

  const onClickAway = () => {
    setEditing(false);
    if (title !== step_title && title) onUpdate(step.id, title, action_id);
  };
  useEffect(() => {
    if (!editing) {
      setTitle(step_title);
    }
  }, [step_title,editing]);



  return (
    <div
      className={`CaseStepRow ${isHovering ? "hovered" : ""} ${
        !noPadding ? "StepPadding" : ""
      }`}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(null)}
    >
      <div className="field-row">
        {isDraggable && (
          <DragIndicatorIcon
            className="icon drag-handler-btn test-step-icon"
            sx={{ color: "#6E8BB7" }}
          />
        )}
        <span className="order">{order}</span>
        {actionResult && (
          <div
            onClick={() => hasActions && order !== 1  && statusChange()}
            className="status-wrapper"
          >
            <p className={`status-label ${!status && "result"}`}>
              {status ? "Action" : "Result"}
            </p>
            <ExpandMoreRoundedIcon
              sx={{ color: "#6E8BB7", transform: "rotate(-90deg)" }}
            />
          </div>
        )}
        <ClickAwayListener onClickAway={onClickAway}>
          <p
            className="case-title"
            onClick={() => hasActions && setEditing(true)}
          >
            {editing ? (
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                autoFocus
              />
            ) : (
              title
            )}
          </p>
        </ClickAwayListener>
      </div>
      {isHovering && hasActions && (
        <DeleteOutlineIcon
          sx={{ color: "#F76659", cursor: "pointer" }}
          onClick={() => onDelete(step.id)}
        />
      )}
    </div>
  );
}
