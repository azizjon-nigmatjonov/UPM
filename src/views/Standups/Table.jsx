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
import "./Standupstyle.scss";
import { FilterIcon } from "../../../src/assets/icons/icons.js";
import Menu from "@mui/material/Menu";
import Select from "react-select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import userService from "../../services/userService";
import roleService from "../../services/roleService";
import projectService from "../../services/projectService";

const StandupsTable = ({
  isLoading,
  loader,
  setSelectedProjects,
  setSelectedStatuses,
  setSelectedRoles,
  setSelectedUsers,
  standups,
  pageCount,
  currentPage,
  setCurrentPage,
  selectedProjects,
  selectedStatus,
  selectedRole,
  selectedUser,
}) => {
  const [menuValue, setMenuValue] = useState(null);
  const [menuStatus, setMenuStatus] = useState(null);
  const [menuRole, setMenuRole] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  const [userList, setUserList] = useState("");
  const [roleList, setRoleList] = useState("");
  const [projectList, setProjectList] = useState("");
  const openProjects = Boolean(menuValue);
  const openstatus = Boolean(menuStatus);
  const openRoles = Boolean(menuRole);
  const openUsers = Boolean(menuUser);

  const openProject = (e) => setMenuValue(e.currentTarget);
  const openStatus = (e) => setMenuStatus(e.currentTarget);
  const openRole = (e) => setMenuRole(e.currentTarget);
  const openUser = (e) => setMenuUser(e.currentTarget);
  const closeProject = () => setMenuValue(null);
  const closeStatus = () => setMenuStatus(null);
  const closeRole = () => setMenuRole(null);
  const closeUser = () => setMenuUser(null);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "#",
      borderRadius: "8px",
      width: "180px",
      borderColor: state.isFocused ? "#cccc" : "#ccc",
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        borderColor: state.isFocused ? "#ccc" : "#ccc",
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      "&:hover": {
        color: "#0E73F6",
      },
      color: "#0E73F6", // Custom colour
      fontSize: "12px",
    }),
  };

  const options = [
    { label: "Сделано", value: 1 },
    { label: "Не сделано", value: -1 },
  ];

  // Get User List
  const getUserList = () => {
    userService
      .getList({
        "client-type-id": "5a3818a9-90f0-44e9-a053-3be0ba1e2c04",
      })
      .then((res) => {
        setUserList(res);
      })
      .catch((err) => {
        console.log("error, getUser", err);
      });
  };

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

  // Get Role List
  const getRoleList = () => {
    roleService
      .getList({
        "client-type-id": "5a3818a9-90f0-44e9-a053-3be0ba1e2c04",
      })
      .then((res) => {
        setRoleList(res);
        // console.log("res", res);
      })
      .catch((err) => {
        console.log("error, getUser", err);
      });
  };

  useEffect(() => {
    getUserList();
    getRoleList();
    getProjectList();
  }, []);

  return (
    <CTable
      // callOnScroll
      count={pageCount}
      page={currentPage}
      setCurrentPage={setCurrentPage}
      columnsCount={4}
      loader={loader}
      removableHeight={200}
      disablePagination
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={48}>№</CTableCell>
          <CTableCell>
            <div className="title_name">
              Проекты
              <span className="table_filter" onClick={openProject}>
                <FilterIcon />
              </span>
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Menu
                anchorEl={menuValue}
                open={openProjects}
                onClose={closeProject}
                className="menu"
              >
                <div className="menu_item">
                  <Select
                    defaultMenuIsOpen
                    styles={customStyles}
                    placeholder="Проекты..."
                    isClearable={true}
                    defaultValue={selectedProjects}
                    options={
                      projectList &&
                      projectList
                        ?.sort((a, b) => a?.title.localeCompare(b.title))
                        .map((item, index) => ({
                          label: item?.title,
                          value: item?.id,
                        }))
                    }
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    onChange={(e) => {
                      setSelectedProjects(e);
                      closeProject();
                    }}
                  />
                </div>
              </Menu>
            </LocalizationProvider>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Статус стендапa{" "}
              <span className="table_filter" onClick={openStatus}>
                <FilterIcon />
              </span>
            </div>
            <Menu
              anchorEl={menuStatus}
              open={openstatus}
              onClose={closeStatus}
              className="menu"
            >
              <div className="menu_item">
                <Select
                  defaultMenuIsOpen
                  styles={customStyles}
                  placeholder="Статусы..."
                  isClearable={true}
                  defaultValue={selectedStatus}
                  options={options}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  onChange={(e) => {
                    setSelectedStatuses(e);
                    closeStatus();
                  }}
                />
              </div>
            </Menu>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Направление
              <span className="table_filter" onClick={openRole}>
                <FilterIcon />
              </span>
            </div>
            <Menu
              anchorEl={menuRole}
              open={openRoles}
              onClose={closeRole}
              className="menu"
            >
              <div className="menu_item">
                <Select
                  defaultMenuIsOpen
                  styles={customStyles}
                  placeholder="Направление..."
                  isClearable={true}
                  defaultValue={selectedRole}
                  options={roleList?.roles?.map((e, key) => ({
                    label: e?.name,
                    value: e?.id,
                  }))}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  onChange={(e) => {
                    setSelectedRoles(e);
                    closeRole();
                  }}
                />
              </div>
            </Menu>
          </CTableCell>
          <CTableCell>
            <div className="title_name">
              Сотрудник
              <span className="table_filter" onClick={openUser}>
                <FilterIcon />
              </span>
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Menu
                anchorEl={menuUser}
                open={openUsers}
                onClose={closeUser}
                className="menu"
              >
                <div className="menu_item">
                  <Select
                    defaultMenuIsOpen
                    styles={customStyles}
                    placeholder="Сотрудник..."
                    isClearable={true}
                    defaultValue={selectedUser}
                    options={userList?.users?.map((e, key) => ({
                      label: e?.name,
                      value: e?.id,
                    }))}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    onChange={(e) => {
                      setSelectedUsers(e);
                      closeUser();
                    }}
                  />
                </div>
              </Menu>
            </LocalizationProvider>
          </CTableCell>
          <CTableCell>
            <div className="title_name">Дата</div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">Статус</div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">Задачи</div>
          </CTableCell>
          <CTableCell>
            <div className="title_name">Комментарии</div>
          </CTableCell>
          {/* <CTableCell width={48}>
            <TableChart />
          </CTableCell> */}
        </CTableHeadRow>
      </CTableHead>
      <CTableBody
        loader={!standups?.length && isLoading}
        columnsCount={10}
        dataLength={standups?.length}
      >
        {standups?.map((standup, index) => (
          <CTableRow>
            {/* key={standup?.id} */}
            <CTableCell>{index + 1}</CTableCell>
            <CTableCell>{standup?.project_title}</CTableCell>
            {standup?.status === 1 ? (
              <CTableCell id="status_done" align="center">
                <p>{"Сделано"}</p>
              </CTableCell>
            ) : (
              <CTableCell id="status_notdone" align="center">
                <p>{`Не сделано ${standup?.members_fact}/${standup?.members_plan}`}</p>
              </CTableCell>
            )}
            <CTableCell>{standup?.user?.role_title}</CTableCell>
            <CTableCell>{standup?.user?.name}</CTableCell>
            <CTableCell>
              {standup?.subtasks.map((subtask, index) => (
                <CTableRow key={subtask?.id}>
                  {subtask?.deadline &&
                    format(new Date(subtask?.deadline), "dd.MM.yyyy")}
                </CTableRow>
              ))}
            </CTableCell>
            <CTableCell>
              {standup?.subtasks.map((subtask, index) => (
                <CTableRow key={subtask?.id}>{subtask?.status_title}</CTableRow>
              ))}
            </CTableCell>
            <CTableCell>
              <div className="tasks_cell">
                {standup?.subtasks.map((subtask, index) => (
                  <CTableRow key={subtask?.id}>{subtask?.title}...</CTableRow>
                ))}
              </div>
            </CTableCell>
            <CTableCell>
              {standup?.subtasks.map((subtask, index) => (
                <CTableRow key={subtask?.id}>{subtask?.comment}</CTableRow>
              ))}
            </CTableCell>
            {/* <CTableCell>
              {
                <button className="standUp_btn">
                  <ThreeDotsIcon />
                </button>
              }
            </CTableCell> */}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default StandupsTable;
