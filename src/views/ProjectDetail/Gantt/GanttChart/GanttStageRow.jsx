import { useMemo } from "react"
import { useSelector } from "react-redux"
import GanttSubtaskRow from "./GanttSubtaskRow"
import StaticGanttItem from "./StaticGanttItem"

const GanttStageRow = ({ stage }) => {

  const openedStages = useSelector(state => state.stage.openedStages)
  const allSubtaskList = useSelector((state) => state.subtask.list)

  const childBlockVisible = useMemo(() => {
    return openedStages.includes(stage.id)
  }, [openedStages, stage.id])

  const subtaskList = useMemo(() => {
    return allSubtaskList.filter((subtask) => subtask.stage_id === stage.id) ?? []
  }, [allSubtaskList, stage])

  const computedIndexes = useMemo(() => {

    let expectedStartIndex = 10000
    let expectedEndIndex = 0
    let factStartIndex = 10000
    let factEndIndex = 0

    subtaskList.forEach(subtask => {
      if(subtask.expectedStartIndex < expectedStartIndex) expectedStartIndex = subtask.expectedStartIndex
      if(subtask.expectedEndIndex > expectedEndIndex) expectedEndIndex = subtask.expectedEndIndex
      if(subtask.factStartIndex < factStartIndex) factStartIndex = subtask.factStartIndex
      if(subtask.factEndIndex > factEndIndex) factEndIndex = subtask.factEndIndex
    })

    const data = {
      expectedStartIndex,
      expectedEndIndex,
      factStartIndex,
      factEndIndex
    }

    return data
  
  }, [subtaskList])
  
  const computedPercent = useMemo(() => {
    let done = stage.count_done || 0;
    let all = stage.count_all || 0;
    return Math.round((done / all) * 100); 
  }, [stage])

  return <div className="GanttStageRow">
    <StaticGanttItem title={stage.title} {...computedIndexes} percent={computedPercent}  type="stage" />

    {
      childBlockVisible && subtaskList.map(subtask => (
        <GanttSubtaskRow key={stage.id} subtask={subtask} />
      ))
    }

  </div>
}


export default GanttStageRow
