import { useEffect, useMemo, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import {
  ChevronBottomIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronTopIcon,
  CloseIcon,
  FilterIcon,
} from "../../assets/icons/icons";
import EmptyDataComponent from "../../components/EmptyDataComponent";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import SearchInput from "../../components/SearchInput";
import useDebounce from "../../hooks/useDebounce";
import departmentService from "../../services/departmentService";
import developerService from "../../services/developerService";
import userService from "../../services/userService";
import workloadService from "../../services/workloadService";
import { applyDrag } from "../../utils/applyDrag";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Select from "react-select";
import OutsideClickHandler from "react-outside-click-handler";
import { useDispatch, useSelector } from "react-redux";
import { workloadActions } from "../../redux/slices/workload.slice";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AvialableModal from "./AvialableModal";

const customStyles = {
  control: (base, state) => ({
    ...base,
    width: "150px",
  }),
};

const WorkloadTableDrag = ({
  isEditMode,
  projects,
  ComputedRoles,
  setProjects = () => {},
  getWorkload = () => {},
  getWorkloadPlan = () => {},
  fromDate,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState("");
  const [isDeleting, setIsDeleting] = useState();
  const [plan, setPlan] = useState(0);
  const [given, setGiven] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchDev, setSearchDev] = useState("");
  const [users, setUsers] = useState([]);
  const [depId, setDepId] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [availableUsers, setAvailableUsers] = useState({});
  const projectTypeList = useSelector(
    (state) => state.project_types.project_types
  );

  const remove = (arr, indexArr) => {
    return arr?.filter((_, index) => indexArr?.includes(index));
  };

  const computedProjectTypesList = useMemo(() => {
    return projectTypeList?.map((projectTypes) => ({
      label: projectTypes?.title,
      value: projectTypes?.id,
    }));
  }, [projectTypeList]);

  const changeOrder = (arr, orderOne, orderTwo) => {
    const result = [...arr];
    const itemOne = result.splice(orderOne, 1)[0];
    result.splice(orderTwo, 0, itemOne);
    return result;
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(projects, dropResult);

    if (result) {
      setProjects(
        changeOrder(projects, dropResult.removedIndex, dropResult.addedIndex)
      );
      dispatch(
        workloadActions.setWorkloadProjects(
          changeOrder(projects, dropResult.removedIndex, dropResult.addedIndex)
        )
      );
      updateOrder(dropResult);
    }
  };

  const updateOrder = ({ removedIndex, addedIndex }) => {
    workloadService
      .updateOrder({
        id: projects[removedIndex].id,
        order_number: addedIndex + 1,
      })
      .then((res) => {
        getWorkload();
      })
      .catch((err) => console.log("ERR", err));
  };

  const updatePlan = useDebounce((depId, planType, val) => {
    if (!isEditMode) return;
    if (!planType & !Number(val)) return;
    departmentService
      .uptadeDepPlan({
        id: depId,
        plan: planType
          ? planType === "ADD"
            ? Number(plan) + 0.25
            : Number(plan) - 0.25
          : Number(val),
      })
      .then((res) => {
        getWorkload();
        getWorkloadPlan();
        // setEditing("");
      })
      .catch((err) => {
        setEditing("");
      });
  }, 400);

  const updateGiven = useDebounce((ID, userId, givenType, val) => {
    if (!isEditMode) return;
    // if (!givenType & !Number(val)) return;
    developerService
      .uptadeDevGiven({
        id: ID,
        user_id: userId,
        given: givenType
          ? givenType === "ADD"
            ? Number(given) + 0.25 > 1
              ? 1
              : Number(given) + 0.25
            : Number(given) - 0.25 < 0
            ? 0
            : Number(given) - 0.25
          : Number(val),
      })
      .then((res) => {
        getWorkload();
      })
      .catch((err) => {
        setEditing("");
      });
  }, 400);

  const deleteDeveloper = useDebounce((devId) => {
    if (!isEditMode) return;
    developerService
      .deleteDev(devId)
      .then((res) => {
        getWorkload();
      })
      .catch((err) => console.log("Err", err));
  }, 300);

  const getUsers = useDebounce((params) => {
    userService
      .getList(params)
      .then((res) => {
        setUsers(res?.users);
      })
      .catch((err) => console.log("Err", err));
  }, 300);

  const postDeveloper = (user) => {
    if (!user?.id) return;
    developerService
      .postDev({
        department_id: depId,
        devs: [
          {
            given: 1,
            user_id: user?.id,
          },
        ],
      })
      .then((res) => {
        setIsSearching(false);
        getWorkload();
        setSearchDev("");
      })
      .catch((err) => console.log("err", err));
  };

  const getAvailableUsers = (role) => {
    workloadService
      .getReport({ role_id: role.role_id, from_date: fromDate })
      .then((res) => {
        res.role = role;
        setAvailableUsers(res);
        if (res) {
          setOpen(true);
        }
      });
  };

  useEffect(() => {
    getUsers({ search: searchDev });
  }, [searchDev]);

  return (
    <div style={{ padding: 0 }}>
      <div className="projectsTable">
        <div
          className="table-head"
          style={{
            minWidth:
              ComputedRoles().filter((item) => item.checked).length > 4
                ? "2600px"
                : "1000px",
            // minWidth: "2500px"
          }}
        >
          <div className="table-head table-row">
            <div
              className="table-cell"
              style={{
                position: "sticky",
                left: "0",
                backgroundColor: "#fff",
                color: "#000 !important",
                fontWeight: "500",
                height: "56px",
                borderBottom: "2px solid #ccc",
                zIndex: "2",
              }}
            >
              №
            </div>
            <div
              className="table-cell"
              id="table_titles"
              style={{
                position: "sticky",
                left: "50px",
                backgroundColor: "#fff",
                color: "#000 !important",
                fontWeight: "500",
                height: "56px",
                borderRight: "2px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
                zIndex: "2",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpenFilter(!openFilter);
              }}
            >
              Projects
              <div
                style={{
                  position: "relative",
                }}
              >
                <FilterIcon color={selectedType ? "#0E73F6" : "#6E8BB7"} />
                {openFilter && (
                  <OutsideClickHandler
                    onOutsideClick={() => setOpenFilter(false)}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "0",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        styles={customStyles}
                        isClearable={true}
                        options={computedProjectTypesList}
                        value={selectedType}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                        onChange={(e) => {
                          setSelectedType(e);
                          setOpenFilter(false);
                        }}
                      />
                    </div>
                  </OutsideClickHandler>
                )}
              </div>
            </div>
            {ComputedRoles()
              ?.filter((check) => check?.checked)
              ?.map((role) => (
                <div
                  id="table_titles"
                  className={`table-cell ${
                    role?.plan > role?.fact
                      ? "role_active"
                      : role?.fact > role?.plan
                      ? "role_fact"
                      : ""
                  }`}
                  style={{ height: "56px" }}
                  key={role?.id}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {role?.name} {`(${role?.plan} / ${role?.fact})`}
                    <IconButton onClick={() => getAvailableUsers(role)}>
                      <VisibilityIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          className="table-body"
          style={{
            minWidth:
              ComputedRoles().filter((item) => item.checked).length > 4
                ? "2600px"
                : "1000px",
            // minWidth: "2500px"
          }}
        >
          {loader ? (
            <div className="table_loader">
              <RingLoaderWithWrapper />
            </div>
          ) : (
            <Container
              onDrop={onDrop}
              dropPlaceholder={{ className: "drag-row-drop-preview" }}
              lockAxis="y"
              dragHandleSelector={isEditMode ? "" : ".drag-handle"}
            >
              {(selectedType
                ? projects?.filter(
                    (project) =>
                      project?.project_type_title === selectedType?.label
                  )
                : projects
              )?.map((project, index) => (
                <Draggable key={project.id}>
                  <div className="table-row">
                    <div
                      className="table-cell"
                      style={{
                        position: "sticky",
                        left: "0",
                        zIndex: "10",
                        color: "#303940 !important",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div
                      className={`table-cell ${
                        project?.plan > project?.fact
                          ? "role_active"
                          : project?.fact > project?.plan
                          ? "role_fact"
                          : ""
                      }`}
                      style={{
                        position: "sticky",
                        left: "50px",
                        zIndex: "10",
                        color: "#303940 !important",
                        borderRight: "2px solid #ccc",
                      }}
                    >
                      {project.project_name}{" "}
                      {`(${project?.plan} / ${project?.fact})`}
                      <div
                        className="projectType"
                        style={{
                          backgroundColor: project?.project_type_color,
                        }}
                      >
                        {project?.project_type_title}{" "}
                      </div>
                    </div>
                    {remove(
                      project?.departments,
                      ComputedRoles()
                        ?.filter((role) => role?.checked)
                        ?.map((role) => role?.order - 1)
                    )?.map((department, idx) => (
                      <div
                        className={`table-cell 
                        ${
                          department?.plan >
                          department?.devs?.reduce(
                            (acc, val) => acc + val?.given,
                            0
                          )
                            ? "role_active"
                            : department?.plan <
                              department?.devs?.reduce(
                                (acc, val) => acc + val?.given,
                                0
                              )
                            ? "role_active_over"
                            : ""
                        }`}
                      >
                        <div className="devs">
                          <div
                            className="plan"
                            onMouseEnter={() => {
                              setEditing(isEditMode ? department?.id : "");
                              setPlan(department?.plan);
                            }}
                          >
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlan((prev) => Number(prev) + 0.25);
                                updatePlan(department?.id, "ADD");
                              }}
                            >
                              <ChevronTopIcon />
                            </span>
                            <input
                              type="text"
                              maxLength={4}
                              value={
                                editing === department?.id
                                  ? plan
                                  : department?.plan
                              }
                              disabled
                              style={{
                                width: "40px",
                                border: "none",
                                textAlign: "center",
                                backgroundColor: "inherit",
                              }}
                              onFocus={() => {
                                setPlan(department?.plan);
                                setEditing(department?.id);
                              }}
                              onChange={(e) => {
                                setPlan(e.target.value);
                                updatePlan(
                                  department?.id,
                                  null,
                                  e.target.value
                                );
                              }}
                            />
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                if (plan < 0.25) {
                                  e.preventDefault();
                                  return;
                                }
                                setPlan((prev) => Number(prev) - 0.25);
                                updatePlan(department?.id, "SUB");
                              }}
                            >
                              <ChevronBottomIcon />
                            </span>
                          </div>
                          {department?.devs?.length ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                marginBottom: "4px",
                                flexGrow: 1,
                              }}
                            >
                              {department?.devs?.map((dev) => (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    whiteSpace: "nowrap",
                                    gap: "8px",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      whiteSpace: "nowrap",
                                      gap: "8px",
                                      justifyContent: "space-between",
                                      flexGrow: "1",
                                    }}
                                    onMouseEnter={() => setIsDeleting(dev?.id)}
                                    onMouseLeave={() => setIsDeleting(null)}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        color: "#303940 !important",
                                      }}
                                    >
                                      <Tooltip
                                        className="tooltip"
                                        placement="top-start"
                                        title={dev?.user_name}
                                      >
                                        <span className="dev_name">
                                          {dev?.user_name}
                                        </span>
                                      </Tooltip>
                                      {isDeleting === dev?.id && (
                                        <span
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteDeveloper(dev?.id);
                                          }}
                                        >
                                          <CloseIcon />
                                        </span>
                                      )}
                                    </div>
                                    {/* Given */}
                                    <div
                                      className="given"
                                      onMouseEnter={() => {
                                        setGiven(dev?.given);
                                        setEditing(isEditMode ? dev?.id : "");
                                      }}
                                    >
                                      <span
                                        className="givenBtn"
                                        style={{
                                          borderRight:
                                            "1px solid rgb(201, 201, 201)",
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setGiven((prev) =>
                                            Number(prev) - 0.25 > 0
                                              ? Number(prev) - 0.25
                                              : 0
                                          );
                                          updateGiven(
                                            dev?.id,
                                            dev?.user_id,
                                            "SUB"
                                          );
                                        }}
                                      >
                                        <ChevronLeftIcon />
                                      </span>
                                      <input
                                        type="text"
                                        maxLength={4}
                                        className={`count_input ${
                                          project?.plan !== project?.fact
                                            ? "active"
                                            : ""
                                        }`}
                                        value={
                                          editing === dev?.id
                                            ? given
                                            : dev?.given
                                        }
                                        disabled
                                        style={{
                                          width: "40px",
                                          border: "none",
                                          textAlign: "center",
                                          backgroundColor: "inherit",
                                        }}
                                        onChange={(e) => {
                                          setGiven(e.target.value);
                                          updateGiven(
                                            dev?.id,
                                            dev?.user_id,
                                            null,
                                            e.target.value
                                          );
                                        }}
                                      />
                                      <span
                                        className="givenBtn"
                                        style={{
                                          borderLeft:
                                            "1px solid rgb(201, 201, 201)",
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setGiven((prev) =>
                                            prev < 1
                                              ? Number(prev) + 0.25 > 1
                                                ? 1
                                                : Number(prev) + 0.25
                                              : prev
                                          );
                                          updateGiven(
                                            dev?.id,
                                            dev?.user_id,
                                            "ADD"
                                          );
                                        }}
                                      >
                                        <ChevronRightIcon />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {Number(
                                department?.plan -
                                  department?.devs?.reduce(
                                    (acc, curr) => acc + curr?.given,
                                    0
                                  )
                              ) > 0 ? (
                                <>
                                  {isSearching !==
                                  department?.project_id + department?.id ? (
                                    <div
                                      className="addUser"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsSearching(
                                          isEditMode
                                            ? department?.project_id +
                                                department?.id
                                            : ""
                                        );
                                        setDepId(department?.id);
                                      }}
                                    >
                                      Add Developer({" "}
                                      {department?.plan -
                                        department?.devs?.reduce(
                                          (acc, curr) => acc + curr?.given,
                                          0
                                        )}{" "}
                                      )
                                    </div>
                                  ) : (
                                    <div style={{ position: "relative" }}>
                                      <div className="extra_search_layer">
                                        <SearchInput
                                          value={searchDev}
                                          onChange={setSearchDev}
                                          className="search_input"
                                        />
                                        <div className="icon_drop">
                                          <ArrowDropDownIcon />
                                        </div>
                                      </div>
                                      {users?.length && searchDev?.length ? (
                                        <div className="searchHolder">
                                          {users?.map((user) => (
                                            <div
                                              className="searchResult"
                                              onClick={() =>
                                                postDeveloper(user)
                                              }
                                            >
                                              {user?.name}
                                            </div>
                                          ))}
                                        </div>
                                      ) : null}
                                    </div>
                                  )}
                                </>
                              ) : null}
                            </div>
                          ) : (
                            <>
                              {isSearching !==
                                department?.project_id + department?.id &&
                              department?.plan > 0 ? (
                                <div className="flex" style={{ gap: "8px" }}>
                                  <div
                                    className="addUser"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsSearching(
                                        isEditMode
                                          ? department?.project_id +
                                              department?.id
                                          : ""
                                      );
                                      setDepId(department?.id);
                                    }}
                                  >
                                    Add Developer( {department?.plan} )
                                  </div>
                                </div>
                              ) : department?.plan > 0 ? (
                                <div style={{ position: "relative" }}>
                                  <div className="search_layer">
                                    <SearchInput
                                      value={searchDev}
                                      onChange={setSearchDev}
                                      className="search_input"
                                    />
                                    <div className="icon_drop">
                                      <ArrowDropDownIcon />
                                    </div>
                                  </div>
                                  {users?.length && searchDev?.length ? (
                                    <div className="searchHolder">
                                      {users?.map((user) => (
                                        <div
                                          className="searchResult"
                                          onClick={() => postDeveloper(user)}
                                        >
                                          {user?.name}
                                        </div>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              ) : (
                                <div className="no_text"></div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Draggable>
              )) ?? <EmptyDataComponent isVisible />}
            </Container>
          )}
        </div>
      </div>

      <AvialableModal
        open={open}
        setOpen={setOpen}
        users={availableUsers}
        setAvailableUsers={setAvailableUsers}
        fromDate={fromDate}
      />
    </div>
  );
};

export default WorkloadTableDrag;
