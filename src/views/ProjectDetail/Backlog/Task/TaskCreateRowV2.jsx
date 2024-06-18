import { Divider } from "@mui/material";
import { useFormik } from "formik";
import FTextField from "../../../../components/FormElements/FTextField";
import { useState } from "react";
import "./style.scss";
import CustomModal from "../../../../components/Modal";
import { format } from "date-fns";
import SaveIcon from "@mui/icons-material/Save";
import { Calendar } from "react-calendar";
import {
  CalendarIcon,
  EpicArrow,
  EpicCloseBtn,
  EpicEditIcon,
  FolderIcon,
  FolderIconBlue,
  LockedIcon,
} from "../../../../assets/icons/icons";

const TaskCreateRowV2 = ({
  task,
  epicTitle,
  openForm,
  setOpenForm = () => {},
  onSubmit = () => {},
  setTextFieldVisible = () => {},
}) => {
  const [openCalendar, setOpenCalendar] = useState("");
  const [editTitle, setEditTitle] = useState(false);

  const taskFormik = useFormik({
    initialValues: {
      ...task,
    },
    onSubmit: (values) => {
      onSubmit({
        ...values,
        locked: values.locked,
      });
    },
  });

  return (
    <CustomModal
      open={openForm}
      setOpen={() => {
        setOpenForm(false);
        taskFormik.resetForm();
        setTextFieldVisible(false);
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
            <span style={{ color: "#252C32" }}>{epicTitle}</span>
          </div>
          <button
            className="close_btn"
            onClick={() => {
              setOpenForm(false);
              taskFormik.resetForm();
              setTextFieldVisible(false);
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
            taskFormik.setFieldValue("locked", 1);
            taskFormik.handleSubmit();
          }}
          style={
            task.locked === 1
              ? { backgroundColor: "#6E8BB7", cursor: "not-allowed" }
              : {}
          }
          disabled={task.locked === 1}
        >
          Save
        </button>
      }
      footerStyle={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px",
      }}
    >
      <div className="customModalBody">
        <div
          className="body_top"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!editTitle ? (
              <div className="customTitle">{taskFormik.values.title}</div>
            ) : (
              <FTextField
                onClick={(e) => e.stopPropagation()}
                formik={taskFormik}
                name="title"
                disabledHelperText
                placeholder="Task title"
              />
            )}
            <div style={{ cursor: "pointer" }}>
              {editTitle ? (
                <span
                  onClick={() => {
                    taskFormik.handleSubmit();
                    setEditTitle(false);
                  }}
                >
                  <SaveIcon sx={{ color: "#0E73F6" }} />
                </span>
              ) : (
                <span onClick={() => setEditTitle(true)}>
                  <EpicEditIcon />
                </span>
              )}
            </div>
          </div>
          {/* Percent */}
          <div
            className="customPercent"
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
            {taskFormik.values.percent || 0}%
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
                task.locked === 1
                  ? setOpenCalendar("")
                  : setOpenCalendar((prev) =>
                      prev === "planned" ? "" : "planned"
                    )
              }
            >
              <span>
                {taskFormik?.values?.start_date?.expected
                  ? format(
                      new Date(taskFormik?.values?.start_date?.expected),
                      "dd-MM-yyyy"
                    )
                  : "-"}
              </span>
              {task.locked === 1 ? <LockedIcon /> : <CalendarIcon />}
            </div>
            {openCalendar === "planned" && (
              <div className="dateCalendar">
                <Calendar
                  value={
                    new Date(
                      taskFormik.values.start_date.expected || Date.now()
                    )
                  }
                  name="start_date"
                  onChange={(e) => {
                    taskFormik.setFieldValue("start_date.expected", e);
                    taskFormik.handleSubmit();
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
              onClick={() => {
                task.locked === 1
                  ? setOpenCalendar("")
                  : setOpenCalendar((prev) => (prev === "due" ? "" : "due"));
              }}
            >
              <span>
                {taskFormik?.values?.end_date?.expected
                  ? format(
                      new Date(taskFormik?.values?.end_date?.expected),
                      "dd-MM-yyyy"
                    )
                  : "-"}
              </span>
              {task.locked === 1 ? <LockedIcon /> : <CalendarIcon />}
            </div>
            {openCalendar === "due" && (
              <div className="dateCalendar">
                <Calendar
                  value={
                    new Date(taskFormik.values.end_date.expected || Date.now())
                  }
                  name="start_date"
                  onChange={(e) => {
                    taskFormik.setFieldValue("end_date.expected", e);
                    taskFormik.handleSubmit();
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
                  ? format(
                      new Date(taskFormik?.values?.start_date?.fact),
                      "dd-MM-yyyy"
                    )
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
                  ? format(
                      new Date(taskFormik?.values?.end_date?.fact),
                      "dd-MM-yyyy"
                    )
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default TaskCreateRowV2;
