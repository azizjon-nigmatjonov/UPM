import { useMemo, useState } from "react"
import FormCard from "../../../../components/FormCard"

import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { Collapse } from "@mui/material"
import CreateRow from "../../../ProjectDetail/Backlog/CreateRow"
import { Container, Draggable } from "react-smooth-dnd"
import TaskTypeRow from "./TaskTypeRow"
import {
  createNewTaskTypeAction,
  updateTaskTypeOrderAction,
} from "../../../../redux/thunks/taskType.thunk"
import { applyDrag } from "../../../../utils/applyDrag"

const StatusCard = () => {
  const dispatch = useDispatch()

  const statusList = useSelector((state) => state.status.list)
  const typeList = useSelector((state) => state.taskType.list)

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
    if (!statusList?.length) return typeList

    return typeList.map((type) => ({
      ...type,
      statuses: statusList.filter(
        (status) => status.project_task_type_id === type.id
      ),
    }))
  }, [statusList, typeList])

  const onDrop = (dropResult) => {
    const result = applyDrag(typeList, dropResult)

    if (result) {
      dispatch(
        updateTaskTypeOrderAction({
          list: result,
          ...dropResult,
        })
      )
    }
  }

  return (
    <FormCard
      visible
      title="Statuses"
      // extra={
      //   <CreateRowButton
      //     formVisible={createFormVisible}
      //     setFunction={setCreateFormVisible}
      //     type="rectangle"
      //   />
      // }
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
