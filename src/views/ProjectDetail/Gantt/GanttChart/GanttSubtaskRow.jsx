import { useDispatch } from "react-redux"
import { editGanttSubtaskPosisitonAction } from "../../../../redux/thunks/subtask.thunk"
import DynamicGanttItem from "./DynamicGanttItem"

const GanttSubtaskRow = ({ subtask }) => {
  const dispatch = useDispatch()

  const onChange = (data) => {
    if (!data) return null

    const beginIndex = Math.floor((data.translate[0] + 2) / 38)
    const endIndex = Math.ceil((data.translate[0] + data.width) / 38)

    dispatch(
      editGanttSubtaskPosisitonAction({
        subtask,
        beginIndex,
        endIndex,
      })
    )
  }

  return (
    <div className="GanttSubtaskRow">
      {subtask.expectedEndIndex && (
        <DynamicGanttItem
          indexes={{
            expectedStartIndex: subtask.expectedStartIndex ?? 0,
            expectedEndIndex: subtask.expectedEndIndex ?? 0,
            factStartIndex: subtask.factStartIndex ?? 0,
            factEndIndex: subtask.factEndIndex ?? 0,
          }}
          onChange={onChange}
          type="subtask"
          title={subtask.title}
          key={subtask.id}
        />
      )}
    </div>
  )
}

export default GanttSubtaskRow
