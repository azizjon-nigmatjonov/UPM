import { Collapse, MenuItem } from "@mui/material"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { Container, Draggable } from "react-smooth-dnd"
import CollapseIcon from "../../../../components/CollapseIcon"
import DroppableBlock from "../../../../components/DroppableBlock"
import { sprintActions } from "../../../../redux/slices/sprint.slice"
import sprintService from "../../../../services/sprintService"
import { applyDrag } from "../../../../utils/applyDrag"
import SubtaskRow from "../Subtask/SubtaskRow"
import "./style.scss" 

const StepRow = ({ index, step, sprintId, currentStep }) => {
  const dispatch = useDispatch()

  const [childBlockVisible, setChildBlockVisible] = useState(false)
  const [dropzoneLoader, setDropzoneLoader] = useState(false)

  const switchChildBlockVisible = () => setChildBlockVisible((prev) => !prev)

  const statusEditDisable = useMemo(() => {
    return currentStep?.id !== step.id
  }, [currentStep?.id, step.id])

  const addSubtaskToStep = (data) => {
    setDropzoneLoader(true)

    const computedData = {
      ...data,
      project_sprint_step_id: step.project_sprint_step_id,
      sprint_id: sprintId,
      subtask_id: data.id,
      subtask_title: data.title,
    }

    sprintService
      .addSubtaskToSprint(computedData)
      .then((res) => {
        const id = res.id

        dispatch(sprintActions.addSubtaskToSprint({
          data: { ...computedData, id },
          stepId: step.id
        }))
      })
      .finally(() => setDropzoneLoader(false))
  }

  const onDrop = (dropResult) => {
    const result = applyDrag(step.sprint_subtask_items, dropResult)
    
    if (result) {

      
      if(result?.length > step.sprint_subtask_items?.length ) {
        addSubtaskToStep(dropResult.payload)
      }
      else {
        // setSubtaskList(result, step.id)
        updateSubtaskOrder(dropResult)
      }
    }
  }

  const updateSubtaskOrder = ({ removedIndex, addedIndex }) => {
    sprintService.updateSprintSubtaskOrder(sprintId, step.id, step.sprint_subtask_items[removedIndex].id, addedIndex + 1)
  }


  return (
    <>
      <MenuItem
        className="StepRow silver-bottom-border pointer level-3"
        onClick={switchChildBlockVisible}
      >
        <CollapseIcon isOpen={childBlockVisible} />
        <div className="index">{index + 1}</div>

        <div className="label">{step.title}</div>
      </MenuItem>

      <Collapse in={childBlockVisible} unmountOnExit>
        <Container
          onDrop={onDrop}
          lockAxis="y"
          dragHandleSelector=".drag-handler-btn"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {step.sprint_subtask_items?.map((subtask) => (
            <Draggable key={subtask.id}>
              <SubtaskRow
                key={subtask.id}
                subtask={subtask}
                step={step}
                sprintId={sprintId}
                index={index}
                disableEdit={step.confirmed}
                sprintSubtask
                statusEditDisable={statusEditDisable}
              />
            </Draggable>
          ))}
        </Container>
        {!step.confirmed && (
          <DroppableBlock onDrop={onDrop} loader={dropzoneLoader} />
        )}
      </Collapse>
    </>
  )
}

export default StepRow
