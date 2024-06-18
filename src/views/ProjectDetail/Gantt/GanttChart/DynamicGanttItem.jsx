import { useEffect, useRef, useState } from "react"
import Moveable from "react-moveable"
import { addPlusSymbol } from "../../../../utils/addPlusSymbol"

const DynamicGanttItem = ({ type, title, indexes, onChange }) => {

  const ref = useRef()
  const [initialIndexes, setInitialIndexes] = useState(indexes)

  const [target, setTarget] = useState()
  const [frame, setFrame] = useState({
    translate: [indexes.expectedStartIndex * 38, 0],
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
    if (beforeTranslate[0] < 0) return null
    target.style.transform = `translateX(${beforeTranslate[0]}px)`
  }

  const onDragEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.beforeTranslate
      onChange(lastEvent)
    }
  }

  // ----------RESIZE ACTIONS----------------------

  const onResizeStart = (e) => {
    e.setOrigin(["%", "%"])
    e.dragStart && e.dragStart.set(frame.translate)
  }

  const onResize = ({ target, width, drag }) => {
    const beforeTranslate = drag.beforeTranslate
    if (beforeTranslate[0] < 0) return null
    target.style.width = `${width}px`
    target.style.transform = `translateX(${beforeTranslate[0]}px)`
  }

  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.drag.beforeTranslate
      onChange(lastEvent.drag)
    }
  }

  return (
    <div className={`DynamicGanttItem ${type}`}>
      <div className={`gantt-row ${type}`}>
        {initialIndexes.factEndIndex > 0 && initialIndexes.factStartIndex > 0 && (
          <div
            className="fact-item"
            style={{
              left: initialIndexes.factStartIndex * 38,
              width:
                (indexes.factEndIndex - initialIndexes.factStartIndex) * 38,
            }}
          >
            <div className="side">
              {addPlusSymbol(
                indexes.factStartIndex - indexes.expectedStartIndex
              )}
            </div>
            <div className="side">
              {addPlusSymbol(indexes.factEndIndex - indexes.expectedEndIndex)}
            </div>
          </div>
        )}
        <div
          ref={ref}
          className="expected-item"
          style={{
            transform: `translateX(${
              initialIndexes.expectedStartIndex * 38
            }px)`,
            width: `${
              (initialIndexes.expectedEndIndex -
                initialIndexes.expectedStartIndex) *
              38
            }px`,
          }}
        >
          <div className="label">{title}</div>
          {/* <div className="percent">{12}%</div> */}
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
    </div>
  )
}

export default DynamicGanttItem
