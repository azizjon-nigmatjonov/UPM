import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ganttActions } from "../../redux/slices/gantt.slice";
import { updateGanttPositionsAction } from "../../redux/thunks/subtask.thunk";
import CSelect from "../CSelect";

const GanttPeriodSelect = () => {
  const dispatch = useDispatch();
  const ganttPeriod = useSelector((state) => state.gantt.ganttPeriod);

  useEffect(() => {
    dispatch(updateGanttPositionsAction());
  }, [ganttPeriod]);

  const ganttPeriods = [
    {
      label: "Week / Day",
      value: "week",
    },
    {
      label: "Month / Day",
      value: "month",
    },
    {
      label: "Year / Month",
      value: "year",
    },
  ];

  if (!ganttPeriods?.[0]) return null;

  return (
    <CSelect
      value={ganttPeriod}
      onChange={(e) => {
        dispatch(ganttActions.setGanttPeriod(e.target.value));
      }}
      options={ganttPeriods}
      label="Period"
      width="200px"
    />
  );
};

export default GanttPeriodSelect;
