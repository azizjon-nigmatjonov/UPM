import { useMemo } from "react";
import { memo } from "react";
import { useSelector } from "react-redux";
import { MONTH, WEEK, YEAR } from "../../../../constans/ganttConsts";
import {
  calculateGanttCalendar,
  calculateGanttCalendarInMonth,
  calculateGanttCalendarInYear,
} from "../../../../utils/calculateGanttCalendar";
import { numToMonth } from "../../../../utils/numToMonth";
import "./style.scss";

const GanttCalendar = () => {
  const startDate = useSelector((state) => state.gantt.startDate);
  const ganttPeriod = useSelector((state) => state.gantt.ganttPeriod);

  const calculatedDates = useMemo(() => {
    return ganttPeriod === "week"
      ? calculateGanttCalendar(startDate ? new Date(startDate) : new Date())
      : ganttPeriod === "month"
      ? calculateGanttCalendarInMonth(
          startDate ? new Date(startDate) : new Date()
        )
      : calculateGanttCalendarInYear(
          startDate ? new Date(startDate) : new Date()
        );
  }, [startDate, ganttPeriod]);

  return (
    <div className="GanttCalendar">
      {calculatedDates?.map((date, index) => (
        <div key={index} className="chapter">
          <div className="week-row calendar-row">
            <div
              className="week-cell cell"
              style={{
                width:
                  ganttPeriod === "week"
                    ? WEEK * date?.dates?.length + "px"
                    : ganttPeriod === "month"
                    ? MONTH * date?.dates?.length + "px"
                    : YEAR * date?.dates?.length + "px",
              }}
            >
              {ganttPeriod === "week"
                ? date?.title
                : ganttPeriod === "month"
                ? numToMonth(date?.title)
                : date?.title}
            </div>
          </div>

          <div className="days-row calendar-row">
            {date.dates?.map((day, index) => (
              <div
                key={index}
                className={`day-cell cell ${
                  ganttPeriod === "week" && (index === 5 || index === 6)
                    ? "weekend"
                    : ""
                }`}
                style={{
                  width:
                    // ganttPeriod === "week" ?  : cellWidth.week,
                    // "38px",
                    ganttPeriod === "week"
                      ? WEEK + "px"
                      : ganttPeriod === "month"
                      ? MONTH + "px"
                      : YEAR + "px",
                }}
              >
                {ganttPeriod === "year" ? numToMonth(day) : day}
                {/* {day} */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(GanttCalendar);
