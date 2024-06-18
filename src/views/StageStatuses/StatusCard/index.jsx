import { useMemo, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Collapse } from "@mui/material"
import { Container, Draggable } from "react-smooth-dnd"
import FormCard from "../../../components/FormCard"
import {
  createNewTaskTypeAction,
  getTaskTypeListAction,
  updateTaskTypeOrderAction,
} from "../../../redux/thunks/taskType.thunk"
import { applyDrag } from "../../../utils/applyDrag"
import CreateRowButton from "../../../components/CreateRowButton"
import CreateRow from "../../ProjectDetail/Backlog/CreateRow"
import TaskTypeRow from "./TaskTypeRow"
import "./style.scss"
import { getStatusListAction } from "../../../redux/thunks/status.thunk"

const StatusCard = () => {
  const dispatch = useDispatch()

  const statusList = useSelector((state) => state.status.list)
  const list = useSelector((state) => state.taskType.list)

  const [createLoader, setCreateLoader] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)

  const onCreateFormSubmit = ({ title }) => {
    setCreateLoader(true)

    dispatch(
      createNewTaskTypeAction({
        title,
      })
    )
      .unwrap()
      .then(() => setCreateFormVisible(false))
      .finally(() => setCreateLoader(false))
  }

  const computedTypes = useMemo(() => {
    if (!statusList?.length) return list

    return list.map((type) => ({
      ...type,
      statuses: statusList.filter(
        (status) => status.project_task_type_id === type.id
      ),
    }))
  }, [statusList, list])

  const onDrop = (dropResult) => {
    const result = applyDrag(list, dropResult)

    if (result) {
      dispatch(
        updateTaskTypeOrderAction({
          list: result,
          ...dropResult,
          id: list[dropResult.removedIndex].id,
        })
      )
    }
  }

  useEffect(() => {
    dispatch(getTaskTypeListAction())
    dispatch(getStatusListAction())
  }, [dispatch])

  return (
    <FormCard
      visible
      title="Statuses"
      extra={
        <CreateRowButton
          formVisible={createFormVisible}
          setFunction={setCreateFormVisible}
          type="rectangle"
        />
      }
    >
      <Collapse in={createFormVisible} className="silver-bottom-border">
        <CreateRow
          onSubmit={onCreateFormSubmit}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
          placeholder="Epic title"
        />
      </Collapse>

      <Container
        onDrop={onDrop}
        lockAxis="y"
        dragHandleSelector=".drag-handler-btn"
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
      >
        {computedTypes?.map((taskType, index) => (
          <Draggable key={taskType.id}>
            <TaskTypeRow
              key={taskType.id}
              taskType={taskType}
              index={index}
              level={1}
            />
          </Draggable>
        ))}
      </Container>
    </FormCard>
  )
}

export default StatusCard
