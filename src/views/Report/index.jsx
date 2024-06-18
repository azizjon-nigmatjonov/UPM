import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Table from "./Table";
import { Card } from "@mui/material";
import { format } from "date-fns";
import FiltersBlock from "../../components/FiltersBlock";
import "./ReportStyle.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ClearIcon from "@mui/icons-material/Clear";
import { getMonth } from "../../utils/getMonth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Menu from "@mui/material/Menu";
import reportService from "../../services/reportService";

function Report(props) {
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };
  const [dateClear, setDateClear] = useState(false);
  const today = new Date();
  const [value, setValue] = useState(today);
  const [open, setOpen] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  useEffect(() => {
    const isFilter = isFilterActive;
    if (selectedProjects?.length > 0) {
      setIsFilterActive(true);
    } else {
      setIsFilterActive(isFilter);
    }
  }, [selectedProjects]);

  const initialFilters = {
    desc_by_name: undefined,
    filter_by_project_percent: undefined,
    filter_by_project_balance: undefined,
    filter_by_sprint_percent: undefined,
    filter_by_standup_percent: undefined,
    filter_by_monday_percent: undefined,
    filter_by_tuesday_percent: undefined,
    filter_by_wednesday_percent: undefined,
    filter_by_thursday_percent: undefined,
    filter_by_friday_percent: undefined,
  };
  const copyInitialFilters = {
    ...initialFilters,
  };
  const [filters, setFilters] = useState(copyInitialFilters);

  const handleChange = (newValue) => {
    setDateClear(true);
    if (!isValidDate(newValue)) return;
    if (newValue !== null) {
      setValue(newValue);
    } else if (newValue === null) {
      setValue(today);
    }
  };
  const getReport = () => {
    setIsLoading(true);
    const {
      desc_by_name,
      filter_by_project_percent,
      filter_by_project_balance,
      filter_by_sprint_percent,
      filter_by_standup_percent,
      filter_by_monday_percent,
      filter_by_tuesday_percent,
      filter_by_wednesday_percent,
      filter_by_thursday_percent,
      filter_by_friday_percent,
    } = filters;
    reportService
      .post({
        date: format(new Date(value), "yyyy-MM-dd"),
        desc_by_name,
        filter_by_project_balance,
        project_ids:
          selectedProjects === undefined ? undefined : selectedProjects,
        filter_by_project_percent,
        filter_by_sprint_percent,
        filter_by_standup_percent,
        filter_by_monday_percent,
        filter_by_tuesday_percent,
        filter_by_wednesday_percent,
        filter_by_thursday_percent,
        filter_by_friday_percent,
      })
      .then((res) => {
        setReportList(res);
      })
      .catch((err) => {
        console.log("Get Report Error", err);
      })
      .finally(() => setIsLoading(false));
  };
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

  useEffect(() => {
    getReport();
  }, [filters, selectedProjects, value]);

  return (
    <div>
      <Header title="Stand-ups" />

      <FiltersBlock
        extra={
          [
            // <PermissionWrapper permission="PROJECTS/CREATE">
            //   <CreateButton onClick={createWorkload} title="Create workload" />
            // </PermissionWrapper>,
          ]
        }
        styles={{ backgroundColor: "none", height: "48px" }}
      >
        {/* <SearchInput value={searchText} onChange={(e) => setSearchText(e)} /> */}
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
              ></button>
            )}
          </div>
        </LocalizationProvider>
        {isFilterActive && (
          <div className="clear_btn" title="Clear Filters">
            <button
              title="Clear Filters"
              onClick={() => {
                setFilters(initialFilters);
                setSelectedProjects([]);
                setIsFilterActive(false);
              }}
            >
              Clear filter
              <span>
                <ClearIcon />
              </span>
            </button>
          </div>
        )}
      </FiltersBlock>

      <div style={{ padding: "10px 20px", borderRadius: "0px" }}>
        <Card style={{ padding: "0px", borderRadius: "0px" }}>
          <Table
            reportList={reportList}
            filters={filters}
            setFilters={setFilters}
            setIsFilterActive={setIsFilterActive}
            initialFilters={initialFilters}
            isLoading={isLoading}
            loader={loader}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
          />
        </Card>
      </div>
    </div>
  );
}

export default Report;
