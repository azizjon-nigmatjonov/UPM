import React from "react";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import FiltersBlock from "../../components/FiltersBlock";
import Header from "../../components/Header";
import standupService from "../../services/standupService";
import Table from "./Table";
import { format } from "date-fns";
import "./Standupstyle.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ClearIcon from "@mui/icons-material/Clear";
import { getMonth } from "../../utils/getMonth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Menu from "@mui/material/Menu";

const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

const Standups = () => {
  const [standups, setStandups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loader, setLoader] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const today = new Date();
  const [value, setValue] = useState(new Date());
  const [dateClear, setDateClear] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (newValue) => {
    setDateClear(true);
    if (!isValidDate(newValue)) return;
    if (newValue !== null) {
      setValue(newValue);
    } else if (newValue === null) {
      setValue(today);
    }
  };

  const pageToOffset = (pageNumber = 1) => {
    return pageNumber * 1;
  };

  const getStandups = (params) => {
    setIsLoading(true);
    setLoader(true);
    standupService
      .getList({
        offset: pageToOffset(currentPage),
        ...params,
      })
      .then((res) => {
        setStandups(res?.standup_list);
        setPageCount(Math.ceil(res?.count / 100));
      })
      .catch((err) => console.log("err", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const data = {
      limit: 100,
      project_id: selectedProject?.value,
      role_id: selectedRole?.value,
      user_id: selectedUser?.value,
      date: value ? format(new Date(value), "yyyy-MM-dd") : "",
      status: selectedStatus?.value,
    };
    getStandups(data);
  }, [
    selectedProject,
    selectedRole,
    selectedStatus,
    selectedUser,
    value,
    currentPage,
  ]);

  const handleDateClear = () => {
    setValue(today);
    setDateClear(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openCalendar = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getMonths = parseInt(format(new Date(value), "MM"));
  const getDays = format(new Date(value), "dd");
  return (
    <div>
      <Header title="Stand-ups" />

      <FiltersBlock styles={{ backgroundColor: "none", height: "48px" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="date_picker" id="standUp_datePicker">
            <div className="calendar_btn" onClick={handleClick}>
              {getMonth(getMonths)} - {getDays}
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openCalendar}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <Calendar
                open={open}
                value={value}
                onChange={(e) => {
                  handleChange(e);
                  setOpen(false);
                  handleClose();
                }}
              />
            </Menu>
            {dateClear && dateClear && (
              <button
                onClick={() => {
                  handleDateClear();
                  // closeDate();
                }}
                className="dateClear_btn"
              >
                <ClearIcon style={{ color: "#333" }} />
              </button>
            )}
          </div>
        </LocalizationProvider>
      </FiltersBlock>

      <div style={{ padding: "10px 20px", borderRadius: "0px" }}>
        <Card style={{ padding: "0px", borderRadius: "0px" }}>
          <Table
            isLoading={isLoading}
            loader={loader}
            setSelectedProjects={setSelectedProject}
            setSelectedStatuses={setSelectedStatus}
            setSelectedRoles={setSelectedRole}
            setSelectedUsers={setSelectedUser}
            standups={standups}
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            selectedProjects={selectedProject}
            selectedStatus={selectedStatus}
            selectedRole={selectedRole}
            selectedUser={selectedUser}
          />
        </Card>
      </div>
    </div>
  );
};

export default Standups;
