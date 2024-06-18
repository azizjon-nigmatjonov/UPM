import React, { useEffect, useState } from "react";
import "./style.scss";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  Button,
  Checkbox,
  ClickAwayListener,
  IconButton,
  Popover,
} from "@mui/material";
import {
  MoreVert,
  DeleteOutline,
  AddCircleOutline,
} from "@mui/icons-material/";
import TModal from "../../TModal";

const styleBtn = {
  borderRadius: 0,
  display: "flex",
  justifyContent: "start",
  padding: 2,
};
const styleTitle = { color: "#303940", fontWeight: 500 };

export default function StepRowForTemplate({
  step,
  order,
  isDraggable = false,
  actionResult = false,
  onUpdate = () => {},
  onDelete = () => {},
  hasActions = true,
  noPadding = false,
  step_title,
  index,
  key,
  caseIsChecked = [],
  setCaseIsChecked = () => {},
  handleOnCreateTemplate = () => {},
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [titleModal, setTitleModal] = useState("");
  const [status, setStatus] = useState(
    step.action_id === "d5bdf861-553d-4477-9577-92b80b75a9e5"
  );
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(step_title);
  const [isOpenModal, setIsOpenModal] = useState(false);
  let action_id = !status
    ? "d5bdf861-553d-4477-9577-92b80b75a9e5"
    : "816d6ff3-ebbe-4027-a919-3ee75a2c219e";
  const handleOnChange = (event, is_checked) => {
    const id = event.target.value;
    if (is_checked) {
      setCaseIsChecked((prev) => [...prev, id]);
    } else {
      const IsChecked = caseIsChecked.filter((item) => item !== id);
      setCaseIsChecked(IsChecked);
    }
  };
  const statusChange = () => {
    setStatus(!status);
    onUpdate(step.id, step_title, action_id);
  };
  const onClickAway = () => {
    setEditing(false);
    if (title !== step_title && title) onUpdate(step.id, title, action_id);
  };
  const handleClose = () => setAnchorEl(null);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);

  const handleOpenModal = () => {
    setIsOpenModal(true);
    handleClose();
  };
  const handleOnDelete = () => {
    onDelete()
    handleClose();
    setIsOpenModal(false);
    setCaseIsChecked([]);
  };
  const handleOnSubmitModal = () => {
    handleOnCreateTemplate(titleModal);
    setIsOpenModal(false);
    setTitleModal("");
    setCaseIsChecked([]);
  };

  useEffect(() => {
    if (!editing) {
      setTitle(step_title);
    }
  }, [step_title, editing]);
  return (
    <div
      className={`CaseStepRow ${isHovering ? "hovered" : ""} ${
        !noPadding ? "StepPadding" : ""
      }`}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(null)}
    >
      <div className="wrap-field-row">
        <Checkbox
          value={step.id}
          checked={caseIsChecked.includes(step.id)}
          onChange={handleOnChange}
        />
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
              onClick={() => hasActions && order !== 1 && statusChange()}
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
      </div>
      <div
        className={
          !caseIsChecked?.length
            ? "is_hovering"
            : index !== 0
            ? "is_hovering"
            : ""
        }
      >
        {caseIsChecked?.length
          ? index === 0 && (
              <>
                <IconButton onClick={handleOpen} color="primary">
                  <MoreVert sx={{ cursor: "pointer" }} />
                </IconButton>
                <Popover
                  id={step.id}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Button
                      fullWidth={true}
                      startIcon={<AddCircleOutline sx={{ color: "#6E8BB7" }} />}
                      sx={{
                        ...styleBtn,
                        borderBottom: "1px solid #E5E9EB",
                      }}
                      onClick={handleOpenModal}
                    >
                      <span style={styleTitle}>Convert into action word</span>
                    </Button>

                    <Button
                      startIcon={<DeleteOutline sx={{ color: "#F76659" }} />}
                      fullWidth={true}
                      sx={styleBtn}
                      onClick={handleOnDelete}
                    >
                      <span style={styleTitle}>Delete</span>
                    </Button>
                  </div>
                </Popover>
              </>
            )
          : ""}
      </div>
      <TModal
        values={{ title: titleModal }}
        open={isOpenModal}
        setOpen={setIsOpenModal}
        onChange={(e) => setTitleModal(e.target.value)}
        onSubmit={handleOnSubmitModal}
      />
    </div>
  );
}
