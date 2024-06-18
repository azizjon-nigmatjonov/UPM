import React, { useState } from "react";
import "./style.scss";
import {
  CalendarIcon,
  EpicEditIcon,
  EpicCloseBtn,
  FolderIcon,
  EpicArrow,
  FolderIconBlue,
  ColorPickerIcon,
  ColorPickerOptionIcon,
  ColorPickerOptionActive,
  LockedIcon,
} from "../../../../assets/icons/icons.js";
import StatusSelect from "../../../../components/StatusSelect";
import { format } from "date-fns";
import Calendar from "react-calendar";
import Menu from "@mui/material/Menu";
import SaveIcon from "@mui/icons-material/Save";
import { isAfter, isEqual } from "date-fns";

function EpicRowDialog({ epic, handleClose, updateHandler, formik }) {
  const [textFieldVisible, setTextFieldVisible] = useState(false);
  const [menuDate, setMenuDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuDate2, setMenuDate2] = useState(null);
  const [invalidDate, setInvalidDate] = useState(false);

  const openDate = Boolean(menuDate);
  const openDate2 = Boolean(menuDate2);
  const openColors = Boolean(anchorEl);
  const setDateMenu = (e) => setMenuDate(e.currentTarget);
  const setDateMenu2 = (e) => setMenuDate2(e.currentTarget);
  const closeDateMenu = (e) => setMenuDate(null);
  const closeDateMenu2 = (e) => setMenuDate2(null);

  function dateIsValid(date) {
    return date instanceof Date && !isNaN(date);
  }

  const handleClickColor = (event) => setAnchorEl(event.currentTarget);
  const handleClosePicker = () => setAnchorEl(null);
  const dateValidation = (start_date, end_date) => {
    if(start_date && end_date) {
      const after = isAfter(new Date(end_date), new Date(start_date));
      const equal = isEqual(new Date(end_date), new Date(start_date));
      if(after) {
        setInvalidDate(false);
      return true;
    }
    if(equal) {
      setInvalidDate(false);
      return true;
    }
    else setInvalidDate(true);
  }
  }

  const statusOptions = [
    { value: "to_do", label: "TO DO" },
    { value: "doing", label: "DOING" },
    { value: "not_done", label: "NOT DONE" },
    { value: "done", label: "DONE" },
  ];

  const colors = [
    "#40BC86",
    "#1ABC9C",
    "#27AE60",
    "#00D717",
    "#F31D2F",
    "#EC555C",
    "#FC575E",
    "#FCB410",
    "#B17E22",
    "#F24D16",
    "#FF8600",
    "#F24D13",
    "#EC6625",
    "#2980B9",
    "#3498DB",
    "#528CCB",
    "#0918EC",
    "#199EC7",
    "#03A2FD",
    "#7B68EE",
    "#4E6D76",
    "#8B96A0",
    "#4D5256",
    "#181D21",
  ];

  return (
    <div className="dialog">
      <div className="dialog_head">
        <div className="dialog_path">
          <div className="dialog_path_item">
            <FolderIcon /> <span>Projects</span> <EpicArrow />
          </div>
          <div className="dialog_path_item">
            <FolderIcon /> <span>Project info</span> <EpicArrow />
          </div>
          <div className="dialog_path_item">
            <FolderIconBlue /> <span>{`${epic?.title ?? ""}`}</span>
          </div>
        </div>
        <button className="close_btn" onClick={handleClose}>
          <EpicCloseBtn />
        </button>
      </div>
      <div className="dialog_title">
        <div className="dialog_title_item">
          <div className="color_picker">
            <span onClick={handleClickColor}>
              <ColorPickerIcon
                color={epic?.color === undefined ? "#1ABC9C" : epic?.color}
              />
            </span>

            <Menu
              anchorEl={anchorEl}
              onClose={handleClosePicker}
              onBlur={handleClosePicker}
              open={openColors}
              hideBackdrop={true}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 0,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            >
              <div className="color_content">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="color_content_item"
                    onClick={(e) => {
                      formik.setFieldValue("color", color);
                      updateHandler({ ...epic, color });
                    }}
                  >
                    {formik.values.color === color ? (
                      <ColorPickerOptionActive color={color} />
                    ) : (
                      <ColorPickerOptionIcon color={color} />
                    )}
                  </div>
                ))}
              </div>
            </Menu>
          </div>
          <div className="dialog_heading">
            {textFieldVisible ? (
              <div className="input_field">
                <input
                  type="text"
                  defaultValue={epic?.title}
                  className="input_control"
                  onChange={(e) => {
                    formik.setFieldValue("title", e.target.value);
                  }}
                />
                <span
                  onClick={() => {
                    updateHandler({ ...epic, title: formik.values.title });
                    setTextFieldVisible(false);
                  }}
                >
                  <SaveIcon color="primary" />
                </span>
              </div>
            ) : (
              <>
                {epic?.title}
                <button
                  className="edit_btn"
                  onClick={() => setTextFieldVisible(true)}
                >
                  <EpicEditIcon styles={{ width: "15px", height: "15px" }} />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="dialog_title_control">
          <div className="dialog_percent">
            {epic?.percent ? epic?.percent : 0}%
          </div>
          <div className="line"></div>
          <div className="dialog_status">
            <StatusSelect
              statusOptions={statusOptions}
              formik={formik}
              updateHandler={updateHandler}
              epic={epic}
            />
          </div>
        </div>
      </div>
      <div className="dialog_details">
        <div className="dialog_details_title">
          <h2>Planned</h2>
          <div className="date_picker">
            <span className="calendar_data">
              {epic?.start_date.expected === undefined
                ? "--"
                : format(
                    new Date(formik?.values.start_date?.expected),
                    "dd.MM.yyyy"
                  )}
            </span>
            {epic?.locked === 1 ? (
              <span className="calendar_locked">
                <LockedIcon />
              </span>
            ) : (
              <span className="calendar_icon" onClick={setDateMenu}>
                <CalendarIcon />
              </span>
            )}
            <Menu open={openDate} anchorEl={menuDate} onClose={closeDateMenu}>
              <Calendar
                value={formik.values.start_date.expected}
                name="start_date"
                onClick={(e) => setInvalidDate(false)}
                onChange={(e) => {
                  formik.setFieldValue("start_date.expected", e);
                  dateValidation(e, formik.values.end_date.expected);
                  // updateHandler({
                  //   ...epic,
                  //   start_date: {
                  //     expected: e,
                  //     fact: formik.values.start_date.fact ?? "",
                  //   },
                  // });
                  closeDateMenu();
                  // setOpen(false)
                }}
              />
              {/* <div className="save_section">
                <button
                  className="save_btn"
                  onClick={() => {
                    closeDateMenu()
                    updateHandler({ ...epic })
                  }}
                >
                  Ok
                </button>
              </div> */}
            </Menu>
          </div>
        </div>
        <div className="dialog_details_title">
          <h2>Due date</h2>
          <div className="date_picker">
            <span className="calendar_data">
              {epic?.end_date.expected === undefined
                ? "--"
                : format(
                    new Date(formik?.values.end_date?.expected),
                    "dd.MM.yyyy"
                  )}
            </span>
            {epic?.locked === 1 ? (
              <span className="calendar_locked">
                <LockedIcon />
              </span>
            ) : (
              <span className="calendar_icon" onClick={setDateMenu2}>
                <CalendarIcon />
              </span>
            )}
            <Menu
              open={openDate2}
              anchorEl={menuDate2}
              onClose={closeDateMenu2}
            >
              <Calendar
                value={formik.values.end_date.expected}
                name="end_date"
                onClick={(e) => setInvalidDate(false)}
                onChange={(e) => {
                  formik.setFieldValue("end_date.expected", e);
                  dateValidation(formik.values.start_date.expected, e)
                  // updateHandler({
                  //   ...epic,
                  //   end_date: {
                  //     expected: e,
                  //     fact: formik.values.end_date.fact ??  "",
                  //   },
                  // });
                  closeDateMenu2();
                  // setOpen(false)
                }}
              />
              {/* <div className="save_section">
                <button
                  className="save_btn"
                  onClick={() => {
                    closeDateMenu2()
                    updateHandler({ ...epic })
                  }}
                >
                  Ok
                </button>
              </div> */}
            </Menu>
          </div>
        </div>
        <div className="dialog_details_title">
          <h2>started</h2>
          <div className="date_picker">
            <span className="calendar_data">
              {dateIsValid(new Date(epic?.start_date.fact)) === true
                ? format(new Date(epic?.start_date?.fact), "dd.MM.yyyy")
                : "--"}
            </span>
          </div>
        </div>
        <div className="dialog_details_title">
          <h2>finished</h2>
          <div className="date_picker">
            <span className="calendar_data">
              {/* {epic?.start_date.fact === undefined
                ? dateIsValid(new Date(epic?.start_date.fact)) === true
                : ""
                ? format(new Date(epic?.end_date?.fact), "dd.MM.yyyy")
                : "--"} */}
              {dateIsValid(new Date(epic?.end_date.fact)) === true
                ? format(new Date(epic?.end_date?.fact), "dd.MM.yyyy")
                : "--"}
            </span>
          </div>
        </div>
      </div>
        {invalidDate && <span className="date-error">Please select valid Date</span>}
      <div className="dialog_submit">
        {epic?.locked === 1 ? (
          <button className="submit_locked">Save</button>
        ) : (
          <button onClick={() =>  {!invalidDate && updateHandler({ ...epic, locked: 1 })}}>
            Save
          </button>
        )}
      </div>
    </div>
  );
}

export default EpicRowDialog;
