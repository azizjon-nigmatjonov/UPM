import { useDispatch, useSelector } from "react-redux";
import { ganttActions } from "../../redux/slices/gantt.slice";
import CSelect from "../CSelect";

const GanttPercentSelect = () => {
  const dispatch = useDispatch();
  const ganttPercent = useSelector((state) => state.gantt.ganttPercent);
  const GanttPercents = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "0% - 25%",
      value: "0_25",
      color: "#f76659",
    },
    {
      label: "26% - 50%",
      value: "26_50",
      color: "#f8dd4e",
    },
    {
      label: "51% - 75%",
      value: "51_75",
      color: "#4094f7",
    },
    {
      label: "76% - 100%",
      value: "76_100",
      color: "#1ac19d",
    },
  ];

  if (!GanttPercents?.[0]) return null;

  return (
    <CSelect
      value={ganttPercent}
      onChange={(e) => {
        dispatch(ganttActions.setGanttPercent(e.target.value));
      }}
      customColor
      options={GanttPercents}
      label="Percent"
      width="200px"
    />
  );
};

export default GanttPercentSelect;
