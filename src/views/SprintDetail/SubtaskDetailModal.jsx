import React, { useState, useMemo } from "react"
import { Card, IconButton, Modal, Typography } from "@mui/material"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import EpicsBlock from "../ProjectDetail/Backlog/Epics/EpicsBlock"
import sprintService from "../../services/sprintService"
import DroppableBlock from "../../components/DroppableBlock"
import SubtaskRow from "../ProjectDetail/Backlog/Subtask/SubtaskRow"
import VersionSelect from "../../components/Selects/VersionSelect"
import LoadingButton from "@mui/lab/LoadingButton"
import ReadMoreIcon from "@mui/icons-material/ReadMore"
import { useDispatch, useSelector } from "react-redux"
import { addMultipleTasksToSprintAction } from "../../redux/thunks/sprint.thunk"

const SubtaskDetailModal = ({ closeModal, addSubtask, step, sprintId , getSprintDetails}) => {
  const dispatch = useDispatch()

  const sprintList = useSelector((state) => state.sprint.list)
  const selectedSubtasks = useSelector((state) => state.subtask.selectedSubtasks)

  const [btnLoader, setBtnLoader] = useState(false)
  const [subtaskList, setSubtaskList] = useState([])
  const [loading, setLoading] = useState(false)
  
  const moveToSprintBtnDisabled = useMemo(() => {
    const sprintSteps = sprintList?.[0]?.steps

    if (!selectedSubtasks?.length) return true
    if (
      !sprintSteps?.[sprintSteps?.length - 1] ||
      sprintSteps?.[sprintSteps?.length - 1]?.confirmed
    ) {
      return true
    }

    return false
  }, [sprintList, selectedSubtasks])


  const onDrop = ({ removedIndex, addedIndex, payload }) => {
    if (removedIndex === null && addedIndex === null) return null
    if (!payload) return null

    addSubtaskToSprint(payload)
  }

  const addSubtaskToSprint = (data) => {
    const computedData = {
      ...data,
      project_sprint_step_id: step.project_sprint_step_id,
      sprint_id: sprintId,
      subtask_id: data.id,
      subtask_title: data.title
    }

    setLoading(true)
    sprintService
      .addSubtaskToSprint(computedData)
      .then((res) => {
        const id = res.id

        setSubtaskList((prev) =>
          prev ? [...prev, { ...computedData, id }] : [{ ...computedData, id }]
        )

        addSubtask({...computedData, id})
      })
      .finally(() => setLoading(false))
  }

  const moveSubtasksToSprint = () => {
    setBtnLoader(true)
    dispatch(addMultipleTasksToSprintAction())
    .then(() => getSprintDetails())
    .then(() => closeModal())
    .finally(() => setBtnLoader(false))
  }


  return (
    <Modal open className="child-position-center" onClose={closeModal}>
      <Card className="SubtaskDetailModal">
        <div className="modal-header">
          <Typography variant="h3" component="h3">
            Add subtask
          </Typography>

          <IconButton color="primary" onClick={closeModal}>
            <HighlightOffIcon fontSize="large" />
          </IconButton>
        </div>
        <div className="modal-body">
          <div className="modal-left">
            <div className="title-block">
              <p className="title">EPICS</p>
              <div className="action-btns">
                <div>
                <VersionSelect />
                </div>
                <LoadingButton
                  variant="outlined"
                  color="primary"
                  loadingPosition="start"
                  className={`move-to-sprint-btn ${
                    moveToSprintBtnDisabled ? "disabled" : ""
                  }`}
                  loading={btnLoader}
                  disabled={moveToSprintBtnDisabled}
                  startIcon={<ReadMoreIcon color="primary" />}
                  endIcon={
                    selectedSubtasks?.length ? (
                      <div className="counter">{selectedSubtasks?.length} </div>
                    ) : (
                      <></>
                    )
                  }
                  onClick={moveSubtasksToSprint}
                >
                  Move to sprint
                </LoadingButton>
              </div>
            </div>
            <EpicsBlock disableEdit={true}></EpicsBlock>
          </div>
          <div className="modal-right">
            <div className="title-block">
              <p className="title">ADDED SUBTASKS</p>
            </div>

            <div className="added-subtasks">
              {subtaskList.map((subtask, index) => (
                <SubtaskRow
                  key={subtask.id}
                  index={index}
                  subtask={subtask}
                  sprintSubtask
                  disableEdit
                />
              ))}
            </div>

            <DroppableBlock onDrop={onDrop} loader={loading} />
          </div>
        </div>
      </Card>
    </Modal>
  )
}

export default SubtaskDetailModal
