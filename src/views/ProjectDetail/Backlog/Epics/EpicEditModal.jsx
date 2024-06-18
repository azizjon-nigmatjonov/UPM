import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {
  CalendarIcon,
  EpicCloseBtn,
  FolderIcon,
  EpicArrow,
  FolderIconBlue,
  ColorPickerIcon,
  ColorPickerOptionIcon,
  ColorPickerOptionActive,
} from '../../../../assets/icons/icons.js';
import Calendar from 'react-calendar';
import Menu from '@mui/material/Menu';
import { format } from 'date-fns';
import FTextField from '../../../../components/FormElements/FTextField';
import { isAfter, isEqual } from "date-fns";

export default function EpicModal({ formik, open, setOpen, epicsList = {}, onCreateFormSubmit = () => {} }) {
  const [invalidDate, setInvalidDate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuDate, setMenuDate] = useState(null);
  const [menuDate2, setMenuDate2] = useState(null);
  const openColors = Boolean(anchorEl);
  const openDate = Boolean(menuDate);
  const openDate2 = Boolean(menuDate2);
  const setDateMenu = (e) => setMenuDate(e.currentTarget);
  const closeDateMenu = (e) => setMenuDate(null);
  const setDateMenu2 = (e) => setMenuDate2(e.currentTarget);
  const closeDateMenu2 = (e) => setMenuDate2(null);
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickColor = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePicker = () => {
    setAnchorEl(null);
  };

  const colors = [
    '#40BC86',
    '#1ABC9C',
    '#27AE60',
    '#00D717',
    '#F31D2F',
    '#EC555C',
    '#FC575E',
    '#FCB410',
    '#B17E22',
    '#F24D16',
    '#FF8600',
    '#F24D13',
    '#EC6625',
    '#2980B9',
    '#3498DB',
    '#528CCB',
    '#0918EC',
    '#199EC7',
    '#03A2FD',
    '#7B68EE',
    '#4E6D76',
    '#8B96A0',
    '#4D5256',
    '#181D21',
  ];

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

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className='dialog'>
        <div className='dialog_head'>
          <div className='dialog_path'>
            <div className='dialog_path_item'>
              <FolderIcon /> <span>Projects</span> <EpicArrow />
            </div>
            <div className='dialog_path_item'>
              <FolderIcon /> <span>Project info</span> <EpicArrow />
            </div>
            <div className='dialog_path_item'>
              <FolderIconBlue /> <span>{`${epicsList?.title ?? ''}`}</span>
            </div>
          </div>
          <button className='close_btn' onClick={handleClose}>
            <EpicCloseBtn />
          </button>
        </div>
        <div className='dialog_title'>
          <div className='dialog_title_item'>
            <div className='color_picker'>
              <span onClick={handleClickColor}>
                <ColorPickerIcon
                  color={formik.values.color}
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
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 0,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      left: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{
                  horizontal: 'left',
                  vertical: 'top',
                }}
                anchorOrigin={{
                  horizontal: 'left',
                  vertical: 'bottom',
                }}
              >
                <div className='color_content'>
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className='color_content_item'
                      onClick={(e) => {
                        formik.setFieldValue('color', color);
                        // updateHandler({...epic, color: formik.values.color})
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
            <div className='dialog_heading'>
              <FTextField name='title' formik={formik} />
            </div>
          </div>
          <div className='dialog_title_control'></div>
        </div>
        <div className='dialog_details'>
          <div className='dialog_details_title'>
            <h2>Planned</h2>
            <div className='date_picker'>
              <span className='calendar_data' onClick={setDateMenu}>{`${
                formik.values?.start_date?.expected === ''
                  ? '-'
                  : format(
                      new Date(formik.values?.start_date?.expected),
                      'dd.MM.yyyy'
                    )
              } `}</span>
              <span className='calendar_icon' onClick={setDateMenu}>
                <CalendarIcon />
              </span>
              <Menu open={openDate} anchorEl={menuDate} onClose={closeDateMenu}>
                <Calendar
                  value={formik.values?.start_date?.expected}
                  name='start_date.expected'
                  onChange={(e) => {
                    formik.setFieldValue('start_date.expected', e);
                    dateValidation(e, formik.values?.end_date?.expected)
                    closeDateMenu();
                  }}
                />
                {/* <div className="save_section">
                          <button
                            className="save_btn"
                            onClick={() => {
                              closeDateMenu()
                            }}
                          >
                            Ok
                          </button>
                        </div> */}
              </Menu>
            </div>
          </div>
          <div className='dialog_details_title'>
            <h2>Due date</h2>
            <div className='date_picker'>
              <span className='calendar_data' onClick={setDateMenu2}>{`${
                formik.values.end_date.expected === ''
                  ? '-'
                  : format(
                      new Date(formik.values.end_date.expected),
                      'dd.MM.yyyy'
                    )
              }`}</span>
              <span className='calendar_icon' onClick={setDateMenu2}>
                <CalendarIcon />
              </span>
              <Menu
                open={openDate2}
                anchorEl={menuDate2}
                onClose={closeDateMenu2}
              >
                <Calendar
                  value={formik.values.end_date.expected}
                  name='end_date.expected'
                  onChange={(e) => {
                    formik.setFieldValue('end_date.expected', e);
                    dateValidation(formik.values.start_date.expected, e)
                    closeDateMenu2();
                  }}
                />
              </Menu>
            </div>
          </div>
          <div className='dialog_details_title'>
            <div className='date_picker'></div>
          </div>
          <div className='dialog_details_title'>
            <div className='date_picker'></div>
          </div>
        </div>
        {invalidDate && <span className="date-error">Please select valid Date</span>}
        <div className='dialog_submit'>
          <button
            className='create_btn'
            onClick={() => {
              if(!invalidDate) {
                onCreateFormSubmit();
                handleClose();
                formik.resetForm();
              }
            }}
          >
            Create
          </button>
        </div>
      </div>
    </Dialog>
  );
}
