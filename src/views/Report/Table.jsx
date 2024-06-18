import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable";
import "./ReportStyle.scss";
import { FilterIcon } from "../../../src/assets/icons/icons.js";
import Menu from "@mui/material/Menu";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import projectService from "../../services/projectService";
import { getMonth } from '../../utils/getMonth.js'
import ReportFilter from "./ReportFilter";
import RingLoaderWithWrapper from '../../components/Loaders/RingLoader/RingLoaderWithWrapper.jsx'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { useRef } from "react";

const StandupsTable = ({
  filters, 
  setFilters,
  setIsFilterActive,
  initialFilters,
  reportList,
  setSelectedProjects,
  isLoading,
  setCurrentPage,
  currentPage,
  loader,
  pageCount,
  selectedProjects,
}) => {
  const [menuValue, setMenuValue] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const openProjects = Boolean(menuValue);
  const closeProject = () => setMenuValue(null);
  
  // Filters
  const [menuProject, setMenuProject] = useState(null);
  const openProjectPercent = Boolean(menuProject);
  const closeProjectPercent = () => setMenuProject(null);
  
  const [menuBalance, setMenuBalance] = useState(null);
  const openProjectBalance = Boolean(menuBalance);
  const closeProjectBalance = () => setMenuBalance(null);
  
  const [menuSprint, setMenuSprint] = useState(null);
  const openProjectSprint = Boolean(menuSprint);
  const closeProjectSprint = () => setMenuSprint(null);
  
  const [menuStandup, setMenuStandup] = useState(null);
  const openProjectStandup = Boolean(menuStandup);
  const closeProjectStandup = () => setMenuStandup(null);
  
  const [menuMonday, setMenuMonday] = useState(null);
  const openProjectMonday = Boolean(menuMonday);
  const closeProjectMonday = () => setMenuMonday(null);
  
  const [menuTuesday, setMenuTuesday] = useState(null);
  const openProjectTuesday = Boolean(menuTuesday);
  const closeProjectTuesday = () => setMenuTuesday(null);
  
  const [menuWednesday, setMenuWednesday] = useState(null);
  const openProjectWednesday = Boolean(menuWednesday);
  const closeProjectWednesday = () => setMenuWednesday(null);
  
  const [menuThursday, setMenuThursday] = useState(null);
  const openProjectThursday = Boolean(menuThursday);
  const closeProjectThursday = () => setMenuThursday(null);
  
  const [menuFriday, setMenuFriday] = useState(null);
  const openProjectFriday = Boolean(menuFriday);
  const closeProjectFriday = () => setMenuFriday(null);

  const openProject = (e) => setMenuValue(e.currentTarget);
  const openProjectPer = (e) => setMenuProject(e.currentTarget);
  const openProjetBalance = (e) => setMenuBalance(e.currentTarget);
  const openProjectSprints = (e) => setMenuSprint(e.currentTarget);
  const openProjectStandups = (e) => setMenuStandup(e.currentTarget);
  const openProjectMon = (e) => setMenuMonday(e.currentTarget);
  const openProjectTue = (e) => setMenuTuesday(e.currentTarget);
  const openProjectWed = (e) => setMenuWednesday(e.currentTarget);
  const openProjectThurs = (e) => setMenuThursday(e.currentTarget);
  const openProjectFri = (e) => setMenuFriday(e.currentTarget);


  // Get Peoject List
  const getProjectList = () => {
    projectService
      .getList()
      .then((res) => {
        setProjectList(res?.projects);
        // console.log("res", res);
      })
      .catch((err) => {
        console.log("error, getUser", err);
      });
  };
  function priceFormat(price) {
    const newPrice = price ? price.toString().split('.') : ''
    if (newPrice[0]) {
      const arr = newPrice[0]?.toString()?.split("");
      while (arr?.length % 3 !== 0) {
        arr?.unshift(" ");
      }
      const result = arr?.join("").match(/.{1,3}/g);
      const res = ('result',`${result.join(' ')}${newPrice[1] ? '.'+newPrice[1] : ''}`);
      return res;
    }
  }

  useEffect(() => {
    getProjectList();
  }, []);

const selectRef = useRef()
  const weekday = [1, 2, 3, 4, 5];
  return (
    <CTable
      count={pageCount}
      page={currentPage}
      setCurrentPage={setCurrentPage}
      columnsCount={4}
      loader={loader}
      removableHeight={220}
      disablePagination={true}
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={48}>№</CTableCell>
          <CTableCell>
            <div className="title_name">
              Projects
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProject}>
                <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuValue}
                  open={openProjects}
                  onClose={closeProject}
                  className="menu"
                  >
              <div className="menu_item">
                <ReportFilter closeProject={closeProject} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="desc_by_name"/>
                
                <div className="" id='multi_select'>
                <ReactMultiSelectCheckboxes
                  ref={selectRef}
                  placeholderButtonLabel='Select project...'
                  isOpen={true}
                  target={true}
                  styles={{
                   display: 'none'
                  }}
                  onChange={(e) => {
                    setSelectedProjects(e?.map((item) => item?.value));
                  }}
                  options={projectList?.sort((a,b) => a?.title.localeCompare(b.title)).map((item, index) => ({
                    label: item?.title,
                    value: item?.id,
                  }))}
                />
                </div>
              </div>
                   </Menu>
              </LocalizationProvider>
              </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
                Project {`(${reportList?.avarage_project_percent || 0}%)`}
                <div className="projects_filter" >
              <div className="table_filter" onClick={openProjectPer}>
              <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuProject}
                  open={openProjectPercent}
                  onClose={closeProjectPercent}
                  className="menu"
                  >
                  <ReportFilter closeProject={closeProjectPercent} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="filter_by_project_percent"/>
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Balance {`(${priceFormat(reportList?.total_project_balance) || 0})`}
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProjetBalance}>
              <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuBalance}
                  open={openProjectBalance}
                  onClose={closeProjectBalance}
                  className="menu"
                  >
                  <ReportFilter closeProject={closeProjectBalance} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive}  filterName="filter_by_project_balance"/>
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Sprint
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Sprint {`(${reportList?.avarage_sprint_percent || 0}%)`}
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProjectSprints}>
              <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuSprint}
                  open={openProjectSprint}
                  onClose={closeProjectSprint}
                  className="menu"
                  >
                   <ReportFilter closeProject={closeProjectSprint} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="filter_by_sprint_percent"/> 
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Standup {`(${reportList?.avarage_total_standup || 0}%)`}
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProjectStandups}>
              <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuStandup}
                  open={openProjectStandup}
                  onClose={closeProjectStandup}
                  className="menu"
                  >
                  <ReportFilter closeProject={closeProjectStandup} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="filter_by_standup_percent"/>
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Mon {`(${reportList?.avarage_monday_standup || 0}%)`}
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProjectMon}>
              <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuMonday}
                  open={openProjectMonday}
                  onClose={closeProjectMonday}
                  className="menu"
                  >
                  <ReportFilter closeProject={closeProjectMonday} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="filter_by_monday_percent"/>
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Tue {`(${reportList?.avarage_tuesday_standup || 0}%)`}
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProjectTue}>
              <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuTuesday}
                  open={openProjectTuesday}
                  onClose={closeProjectTuesday}
                  className="menu"
                  >
                  <ReportFilter closeProject={closeProjectTuesday} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="filter_by_tuesday_percent"/>
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Wen {`(${reportList?.avarage_wednesday_standup || 0}%)`}              
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProjectWed}>
              <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuWednesday}
                  open={openProjectWednesday}
                  onClose={closeProjectWednesday}
                  className="menu"
                  >
                  <ReportFilter closeProject={closeProjectWednesday} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="filter_by_wednesday_percent"/>
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Thu {`(${reportList?.avarage_thursday_standup || 0}%)`}
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProjectThurs}>
              <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuThursday}
                  open={openProjectThursday}
                  onClose={closeProjectThursday}
                  className="menu"
                  >
                    <ReportFilter closeProject={closeProjectThursday} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="filter_by_thursday_percent"/>
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Fri {`(${reportList?.avarage_friday_standup || 0}%)`}
              <div className="projects_filter" >
              <div className="table_filter" onClick={openProjectFri}>
                <span><FilterIcon /></span>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                 <Menu
                  anchorEl={menuFriday}
                  open={openProjectFriday}
                  onClose={closeProjectFriday}
                  className="menu"
                  >
                  <ReportFilter closeProject={closeProjectFriday} initialFilters={initialFilters}  setFilter={setFilters} setIsFilterActive={setIsFilterActive} filterName="filter_by_friday_percent"/>
                   </Menu>
              </LocalizationProvider>
                </div>
            </div>
          </CTableCell>
          {/* <CTableCell width={48}>
            <TableChart />
          </CTableCell> */}
        </CTableHeadRow>
      </CTableHead>
      {isLoading ? (
        <div className="round_loader">
          <RingLoaderWithWrapper/>
        </div>
      ) : (
        <CTableBody
        loader={isLoading}
        columnsCount={10}
        dataLength={reportList?.projects?.length}
      >
        {reportList?.projects?.map((standup, index) => (
          <CTableRow key={index}>
          {/* key={standup?.id} */}
          <CTableCell>{index + 1}</CTableCell>
          <CTableCell>{standup?.project_title}</CTableCell>
          <CTableCell>{standup?.project_percent || 0 }%</CTableCell>
          <CTableCell>{priceFormat(standup?.project_balance) || 0}</CTableCell>
          <CTableCell>{
            standup?.sprint?.from_date === undefined || standup?.sprint?.to_date === undefined ? '-' : `${standup?.sprint?.from_date && 
              format(new Date(standup?.sprint?.from_date), 'dd')}-${standup?.sprint?.to_date && 
                format(new Date(standup?.sprint?.to_date), 'dd')} ${standup?.sprint?.to_date && getMonth(parseInt(format(new Date(standup?.sprint?.to_date), 'MM'), 10))}`
          }</CTableCell>
          <CTableCell>{standup?.sprint?.sprint_percent || 0}%</CTableCell>
          <CTableCell>{standup?.standup?.total_percents || 0}%</CTableCell>
          
           {weekday.map((day) => (
            <CTableCell key={day}>
              {standup?.standup?.days
                  ?.sort((a, b) => a.day_number - b.day_number)
                  ?.find((item) => item.day_number === day)
                  ? `${
                      standup?.standup?.days
                        ?.sort((a, b) => a.day_number - b.day_number)
                        ?.find((item) => item.day_number === day)?.day_percent || 0
                    }% (${
                      standup?.standup?.days
                        .sort((a, b) => a.day_number - b.day_number)
                        ?.find((item) => item.day_number === day)?.member_plan || 0
                    } / ${
                      standup?.standup?.days
                        ?.sort((a, b) => a.day_number - b.day_number)
                        ?.find((item) => item.day_number === day)?.member_fact || 0
                    }) `
                  : '-'}
              </CTableCell>
            ))}
        </CTableRow>
          ))}
      </CTableBody>
      )}
    </CTable>
  );
};

export default StandupsTable;
