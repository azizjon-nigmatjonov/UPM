import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { MONTH, WEEK, YEAR } from "../../../../constans/ganttConsts";
import { addPlusSymbol, subtractSymbol } from "../../../../utils/addPlusSymbol";

const StaticGanttItem = ({
  type = "epic",
  idx,
  title,
  expectedStartIndex,
  expectedEndIndex,
  factStartIndex,
  factEndIndex,
  percent,
}) => {
  const todayRef = useRef(null);
  const ganttPeriod = useSelector((state) => state.gantt.ganttPeriod);
  const indexedDates = useSelector((state) =>
    ganttPeriod === "week"
      ? state.gantt.indexedDates
      : ganttPeriod === "month"
      ? state.gantt.indexedDatesForMonth
      : state.gantt.indexedDatesForYear
  );
  const today = new Date();
  const todayIndex = indexedDates.findIndex(
    (el) =>
      el === format(today, ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy")
  );
  let transparentBgC = "";
  if (factEndIndex === -1) {
    factEndIndex = todayIndex;
    transparentBgC = "#EDEDED";
  }
  if (factStartIndex === -1) {
    factStartIndex = expectedStartIndex;
  }

  useEffect(() => {
    if (todayRef.current.className.includes("flag")) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      })
    }
  }, [ganttPeriod]);
  
  return (
    <div className="StaticGanttItem">
      <div className={`gantt-row ${type}`}>
        <div
          ref={todayRef}
          className={`today ${idx === 0 ? "first flag" : ""}`}
          style={{
            left:
              todayIndex *
                (ganttPeriod === "week"
                  ? WEEK
                  : ganttPeriod === "month"
                  ? MONTH
                  : YEAR) +
              "px",
          }}
        >
          {idx == 0 ? <span className="flag"></span> : <></>}
        </div>
        <div
          className="expected-item"
          style={{
            background:
              percent === 0 || percent <= 25
                ? "#F76659"
                : percent <= 50
                ? "#E0CC60"
                : percent <= 75
                ? "#4094F7"
                : percent <= 100
                ? "#5ABE9F"
                : "#F76659",
            zIndex: 2,
            left:
              expectedStartIndex *
                (ganttPeriod === "week"
                  ? WEEK
                  : ganttPeriod === "month"
                  ? MONTH
                  : YEAR) +
              "px",
            width:
              ganttPeriod === "week"
                ? (expectedEndIndex - expectedStartIndex) * WEEK
                : ganttPeriod === "month"
                ? (expectedEndIndex - expectedStartIndex) * MONTH
                : (expectedEndIndex - expectedStartIndex + 1) * YEAR,
          }}
        >
          {title}
        </div>
        {factEndIndex - factStartIndex > 0 && factStartIndex > 0 && (
          <div
            className="fact-item"
            style={{
              zIndex: 1,
              backgroundColor: transparentBgC
                ? transparentBgC
                : percent === 0 || percent <= 25
                ? "#f78e85"
                : percent <= 50
                ? "#EEE9CC"
                : percent <= 75
                ? "#D7EDFF"
                : percent <= 100
                ? "#E5F5F0"
                : "#f78e85",
              left:
                factStartIndex *
                  (ganttPeriod === "week"
                    ? WEEK
                    : ganttPeriod === "month"
                    ? MONTH
                    : YEAR) +
                "px",
              width:
                ganttPeriod === "week"
                  ? (factEndIndex - factStartIndex) * WEEK
                  : ganttPeriod === "month"
                  ? (factEndIndex - factStartIndex) * MONTH
                  : (factEndIndex - factStartIndex + 1) * YEAR,
            }}
          >
            <div className="side">
              {factEndIndex - expectedEndIndex !== 0
                ? factStartIndex > expectedStartIndex
                  ? subtractSymbol(factStartIndex - expectedStartIndex) +
                    (ganttPeriod === "year" ? "m" : "d")
                  : addPlusSymbol(factStartIndex - expectedStartIndex) +
                    (ganttPeriod === "year" ? "m" : "d")
                : null}
            </div>
            <div className="side">
              {factEndIndex - expectedEndIndex !== 0
                ? factEndIndex > expectedEndIndex
                  ? subtractSymbol(factEndIndex - expectedEndIndex) +
                    (ganttPeriod === "year" ? "m" : "d")
                  : addPlusSymbol(factEndIndex - expectedEndIndex) +
                    (ganttPeriod === "year" ? "m" : "d")
                : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaticGanttItem;
