import { useEffect, useMemo, useRef, useState } from "react"
import Moveable from "react-moveable"
import epicsService from "../../../../services/epicsService"
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { format } from "date-fns";
import subtaskService from "../../../../services/subtaskService";

const ChartItem = ({ color, subtask, indexedDates, epicId, updateSubtask }) => {
  const [target, setTarget] = useState()
  const ref = useRef()

  const computedPercent = useMemo(() => {
    return 0
    // if (epic.count_done === "0" || !epic.count_all === "0") return 0
    // return parseInt((Number(epic.count_done) * 100) / Number(epic.count_all))
  }, [])

  const startPosition = useMemo(() => {
    if (!indexedDates?.length) return 0
    const startDate = format( new Date(subtask.start_date?.expected) , "MM-dd-yyyy")

    const index = indexedDates.findIndex((el) => el === startDate)

    return index * 38
  }, [])

  const computedWidth = useMemo(() => {
    if (!indexedDates?.length) return 0
    const endDate = format( new Date(subtask.end_time) , "MM-dd-yyyy")

    const index = indexedDates.findIndex((el) => el === endDate) + 1

    const result = index * 38 - startPosition

    return result || 266
  }, [])

  const [frame, setFrame] = useState({
    translate: [startPosition, 0],
  })

  useEffect(() => {
    if (!ref?.current) return null
    setTarget(ref.current)
  }, [ref])

  // ---------DRAG ACTIONS------------
  
  const onDragStart = (e) => {
    e.set(frame.translate)
  }

  const onDrag = ({ target, beforeTranslate }) => {
    if(beforeTranslate[0] < 0) return null;
    target.style.transform = `translateX(${beforeTranslate[0]}px)`
  }

  const onDragEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.beforeTranslate
      updatePosition(lastEvent)
    }
  }

  // ----------RESIZE ACTIONS----------------------

  const onResizeStart = (e) => {
    e.setOrigin(["%", "%"])
    e.dragStart && e.dragStart.set(frame.translate)
  }

  const onResize = ({ target, width, drag }) => {
    const beforeTranslate = drag.beforeTranslate
    if(beforeTranslate[0] < 0) return null
    target.style.width = `${width}px`
    target.style.transform = `translateX(${beforeTranslate[0]}px)`
  }

  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.drag.beforeTranslate
      updatePosition(lastEvent.drag)
    }
  }

  // ----------UPDATE REQUESTS----------------

  const updatePosition = (data) => {
    if (!data) return null

    const beginIndex = Math.floor((data.translate[0]) / 38)
    const endIndex = Math.floor((data.translate[0] + data.width) / 38)

    const beginDate = indexedDates[beginIndex] ?? indexedDates[0]
    const endDate = indexedDates[endIndex]

    const computedData = {
      ...subtask,
      start_time: beginDate,
      end_time: endDate
    }

    updateSubtask(epicId, computedData)
    
    subtaskService.update(computedData)

  }


  return (
    <div className={`ChartItem ${color}`} >
      <div
        ref={ref}
        className="target"
        style={{
          transform: `translateX(${startPosition}px)`,
          width: `${computedWidth}px`,
        }}
      >
        <div className="left-side">
          <DragHandleIcon className="drag-icon" />
          <div className="title">{subtask.title}</div>
        </div>
        <div className="percent">{computedPercent}%</div>
      </div>
      <Moveable
        target={target}
        // container={container}
        draggable
        resizable
        // throttleDrag={38}
        // throttleResize={38}
        keepRatio={false}
        origin={false}
        renderDirections={["w", "e"]}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
    </div>
  )
}

export default ChartItem
