import { useSelector } from "react-redux";
import { MONTH, WEEK, YEAR } from "../../../../constans/ganttConsts";
import GanttEpicRow from "./GanttEpicRow";
import "./style.scss";

const GanttChart = () => {
  const ganttPercent = useSelector((state) => state.gantt.ganttPercent);
  const ganttPeriod = useSelector((state) => state.gantt.ganttPeriod);

  const computedEpicsList = useSelector((state) => {
    if (ganttPercent === "all") {
      return state.epic.list;
    } else if (ganttPercent === "0_25") {
      return state.epic.list.filter(
        (el) =>
          (el?.percent ? el?.percent : 0) <= 25 &&
          (el?.percent ? el?.percent : 0) >= 0
      );
    } else if (ganttPercent === "26_50") {
      return state.epic.list.filter(
        (el) => el.percent <= 50 && el.percent > 25
      );
    } else if (ganttPercent === "51_75") {
      return state.epic.list.filter(
        (el) => el.percent <= 75 && el.percent > 50
      );
    } else if (ganttPercent === "76_100") {
      return state.epic.list.filter(
        (el) => el.percent <= 100 && el.percent > 75
      );
    }
  });

  return (
    <div
      className="GanttChart"
      style={{
        backgroundSize:
          ganttPeriod === "week"
            ? WEEK
            : ganttPeriod === "month"
            ? MONTH
            : YEAR,
      }}
    >
      {computedEpicsList.map((epic, idx) => (
        <GanttEpicRow key={epic.id} epic={epic} idx={idx} />
      ))}
    </div>
  );
};

export default GanttChart;
