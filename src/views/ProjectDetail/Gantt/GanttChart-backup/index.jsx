import { format } from "date-fns"
import { useMemo } from "react"
import {
  calculateBeginDate,
  calculateEndDate,
} from "../../../../utils/calculateGanttCalendar"
import ChartItem from "./ChartItem"
import "./style.scss"

const GanttChart = ({ epic, indexedDates, updateSubtask }) => {
  const startPosition = useMemo(() => {
    if (!indexedDates?.length || !epic.subtasks?.length) return 0

    const startDate = format(calculateBeginDate(epic.subtasks), "MM-dd-yyyy")

    const index = indexedDates.findIndex((el) => el === startDate)

    return index * 38
  }, [epic.subtasks, indexedDates])

  const computedWidth = useMemo(() => {
    if (!indexedDates?.length || !epic.subtasks?.length) return 0

    const endDate = format(calculateEndDate(epic.subtasks), "MM-dd-yyyy")

    const index = indexedDates.findIndex((el) => el === endDate) + 1

    const result = index * 38 - startPosition

    return result || 266
  }, [epic.subtasks, indexedDates])

  return (
    <div className="GanttChart">
      <div className="chart-item-row">
        <div className="ChartItem">
          {computedWidth ? (
            <div
              className="target"
              style={{
                left: `${startPosition}px`,
                width: `${computedWidth}px`,
              }}
            >
              <div className="left-side">
                {/* <DragHandleIcon className="drag-icon" /> */}
                <div className="title">{epic.title}</div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {indexedDates?.length ? (
        epic.subtasks?.map((subtask) => (
          <div className="chart-item-row">
            <ChartItem
              key={subtask.id}
              subtask={subtask}
              indexedDates={indexedDates}
              color="yellow"
              updateSubtask={updateSubtask}
              epicId={epic.id}
            />
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  )
}

export default GanttChart
