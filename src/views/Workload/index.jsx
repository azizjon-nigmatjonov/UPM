import Header from "../../components/Header";
import {
  add,
  differenceInDays,
  endOfWeek,
  format,
  startOfWeek,
} from "date-fns";
import FiltersBlock from "../../components/FiltersBlock";
import WeekPicker from "./WeekPicker";
import { useEffect, useMemo, useState } from "react";
import workloadService from "../../services/workloadService";
import { Card } from "@mui/material";
import TableDrag from "./TableDrag";
import { ExtraFunction, EditIconBlue } from "../../assets/icons/icons";
import SaveIcon from "@mui/icons-material/Save";
import FormControlLabel from "@mui/material/FormControlLabel";
import DownloadIcon from "@mui/icons-material/Download";
import OutsideClickHandler from "react-outside-click-handler";
import "./workload.scss";
import { useDispatch, useSelector } from "react-redux";
import { workloadActions } from "../../redux/slices/workload.slice";
import { sortByRoleId } from "../../utils/sortByRoleId";
import IOSSwitch from "../../components/Switch";

const Workload = () => {
  const dispatch = useDispatch();
  const workloadProjects = useSelector(
    (state) => state.workload?.workloadProjects
  );
  const workloadPlans = useSelector((state) => state.workload?.workloadPlans);
  const workloadFilters = useSelector(
    (state) => state.workload.workloadFilters
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [projects, setProjects] = useState(workloadProjects);
  const [plans, setPlans] = useState(workloadPlans);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDateValid, setIsDateValid] = useState(false);
  const [excelCopy, setExcelCopy] = useState(false);
  const today = new Date();
  const [openFilter, setOpenFilter] = useState(false);
  const [filterElements, setFilterElements] = useState(workloadFilters);

  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  const createWorkload = (dayDiff) => {
    const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
    const startOfNextWeek = startOfWeek(add(new Date(), { weeks: 1 }), {
      weekStartsOn: 1,
    });
    const endOfNextWeek = endOfWeek(add(new Date(), { weeks: 1 }), {
      weekStartsOn: 1,
    });
    workloadService
      .createWorkload({
        from_date: format(
          dayDiff === 7 ? startOfThisWeek : startOfNextWeek,
          "yyyy-MM-dd"
        ),
        to_date: format(
          dayDiff === 7 ? endOfThisWeek : endOfNextWeek,
          "yyyy-MM-dd"
        ),
      })
      .then((res) => {
        getWorkload();
        getWorkloadPlan();
      })
      .catch((err) => {
        console.log("errrorororro", err);
      });
  };

  const getWorkload = () => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 }); // This week monday
    const mondayOfSelectedWeek = startOfWeek(add(selectedDate, { weeks: 1 }), {
      weekStartsOn: 1,
    }); // Next week monday
    const dayDiff = differenceInDays(mondayOfSelectedWeek, monday);
    workloadService
      .getWorkload({
        start_date: format(
          startOfWeek(selectedDate, { weekStartsOn: 1 }),
          "yyyy-MM-dd"
        ),
      })
      .then((res) => {
        setProjects(
          res?.projects?.sort(function (a, b) {
            return a?.order_number - b?.order_number;
          })
        );
        dispatch(
          workloadActions.setWorkloadProjects(
            res?.projects?.sort(function (a, b) {
              return a?.order_number - b?.order_number;
            })
          )
        );
      })
      .catch((err) => {
        setProjects([]);
        setPlans([]);
        (dayDiff === 7 || (isWeekend && dayDiff === 14)) &&
          createWorkload(dayDiff);
      });
    if (today.getDay() === 5 || today.getDay() === 0) {
      setIsDateValid(true);
    }
  };

  const getWorkloadPlan = () => {
    workloadService
      .getWorkloadPlan({
        start_date: format(
          startOfWeek(selectedDate, { weekStartsOn: 1 }),
          "yyyy-MM-dd"
        ),
      })
      .then((res) => {
        setPlans(res?.plan_fact?.sort(sortByRoleId));
        dispatch(
          workloadActions.setWorkloadPlans(res?.plan_fact?.sort(sortByRoleId))
        );
      })
      .catch((err) => {
        console.log("Err", err);
        setPlans([]);
      });
  };
  const downLoadExcel = () => {
    workloadService
      .getDownloadExcel({
        start_date: format(
          startOfWeek(selectedDate, { weekStartsOn: 1 }),
          "yyyy-MM-dd"
        ),
      })
      .then((res) => {
        setExcelCopy(res.excel_url);
      });
  };

  const ComputedRoles = () => {
    const sortedRoles = [...filterElements]?.sort(sortByRoleId);

    const merged =
      plans?.map((plan, index) => {
        return {
          ...plan,
          ...sortedRoles?.[index],
        };
      }) || [];

    return merged?.sort((a, b) => {
      return a?.order - b?.order;
    });
  };

  const filterHandler = (val, id) => {
    const newFilterElements = filterElements?.map((el) => {
      if (el.role_id === id) {
        return {
          ...el,
          checked: val,
        };
      }
      return el;
    });
    setFilterElements(newFilterElements);
    dispatch(workloadActions.setWorkloadFilters(newFilterElements));
  };

  const fromDate = useMemo(() => {
    return format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
  }, [selectedDate]);

  useEffect(() => {
    getWorkload();
    getWorkloadPlan();
  }, [selectedDate]);

  return (
    <div>
      <Header title="Workload" />
      <FiltersBlock
        extra={[
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #eee",
              borderRadius: "6px",
              padding: "11px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
            onClick={() => setOpenFilter(!openFilter)}
          >
            <ExtraFunction
              color={
                filterElements.filter((el) => el.checked).length !== 0
                  ? "#0E73F6"
                  : "#6E8BB7"
              }
            />
            {openFilter && (
              <OutsideClickHandler
                onOutsideClick={() => {
                  setOpenFilter(false);
                }}
              >
                <div
                  className="tableFilters"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="filterItem">
                    <div>ALL</div>
                    <FormControlLabel
                      sx={{
                        m: 0,
                      }}
                      control={<IOSSwitch defaultChecked />}
                      label=""
                      checked={
                        filterElements.filter((el) => el.checked).length ===
                        filterElements.length
                      }
                      onChange={(e) => {
                        const newFilterElements = filterElements.map((el) => {
                          return {
                            ...el,
                            checked: e.target.checked,
                          };
                        });
                        setFilterElements(newFilterElements);
                        dispatch(
                          workloadActions.setWorkloadFilters(newFilterElements)
                        );
                      }}
                    />
                  </div>
                  {filterElements?.map((el) => (
                    <div className="filterItem">
                      <div className="filterContext">
                        {/* <DotsIcon /> */}
                        {el.name}
                      </div>
                      <FormControlLabel
                        sx={{
                          m: 0,
                        }}
                        control={<IOSSwitch defaultChecked />}
                        label=""
                        checked={el.checked}
                        onChange={(e) => {
                          filterHandler(e.target.checked, el.role_id);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </OutsideClickHandler>
            )}
          </div>,
          <button
            style={{
              backgroundColor: "#fff",
              border: "1px solid #eee",
              borderRadius: "6px",
              padding: "5px",
              cursor: "pointer",
              height: "36px",
              width: "36px",
            }}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? (
              <SaveIcon style={{ color: "#0E73F6" }} />
            ) : (
              <EditIconBlue />
            )}
          </button>,
        ]}
        styles={{ backgroundColor: "none", height: "48px" }}
      >
        <WeekPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isDateValid={isDateValid}
          views={["month", "day"]}
        />
        <a
          href={excelCopy}
          alt="download"
          download="excel"
          className="download_btn"
          onClick={downLoadExcel}
        >
          <DownloadIcon style={{ color: "#0e73f6" }} />
        </a>
      </FiltersBlock>
      <div style={{ padding: "10px 20px", borderRadius: "0px" }}>
        <Card style={{ padding: "0px", borderRadius: "0px" }}>
          <TableDrag
            projects={projects}
            ComputedRoles={ComputedRoles}
            getWorkload={getWorkload}
            getWorkloadPlan={getWorkloadPlan}
            fromDate={fromDate}
            setProjects={setProjects}
            isDraggable={isEditMode}
            isEditMode={isEditMode}
          />
        </Card>
      </div>
    </div>
  );
};

export default Workload;
