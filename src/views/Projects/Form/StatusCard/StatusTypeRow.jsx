import { Collapse, MenuItem } from "@mui/material"
import { useMemo, useState } from "react"
import RowLinearLoader from "../../../../components/RowLinearLoader"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import CreateRow from "../../../ProjectDetail/Backlog/CreateRow"
import CollapseIcon from "../../../../components/CollapseIcon"
import { createNewStatusAction } from "../../../../redux/thunks/status.thunk"
import { Draggable, Container } from "react-smooth-dnd"
import StatusRow from "./StatusRow"

const StatusTypeRow = ({ statusType }) => {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const allStatusList = useSelector((state) => state.status.list)

  const [textFieldVisible, setTextFieldVisible] = useState(false)
  const [linearLoader, setLinearLoader] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)
  const [childBlockVisible, setChildBlockVisible] = useState(false)

  const statusList = useMemo(() => {
    return (
      allStatusList.filter(
        (status) => status.status_group_id === statusType.id
      ) ?? []
    )
  }, [allStatusList, statusType.id])

  const openChildBlock = () => {
    setChildBlockVisible(true)
  }

  const switchChildBlockVisible = () => {
    if (!childBlockVisible) return openChildBlock()
    setChildBlockVisible(false)
  }

  const createStatus = ({ title }) => {
    const data = {
      project_id: projectId,
      project_task_type_id: statusType.project_task_type_id,
      status_group_id: statusType.id,
      state: statusType.state,
      title,
    }
    setCreateLoader(true)
    dispatch(createNewStatusAction(data))
      .unwrap()
      .then((res) => {
        setCreateFormVisible(false)
        setChildBlockVisible(true)
      })
      .catch(() => setCreateLoader(false))
  }

  return (
    <>
      <MenuItem
        className="StatusTypeRow silver-bottom-border pointer"
        onClick={switchChildBlockVisible}
      >
        <CollapseIcon fill="#0E73F6" isOpen={childBlockVisible} />
        <div className="label">{statusType.title}</div>

        <RowLinearLoader visible={linearLoader} />
      </MenuItem>

      <Collapse in={createFormVisible} className="silver-bottom-border">
        <CreateRow
          onSubmit={createStatus}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
        />
      </Collapse>

      <Collapse in={childBlockVisible && !textFieldVisible}>
        <Container
          // onDrop={onDrop}
          lockAxis="y"
          dragHandleSelector=".drag-handler-btn"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {statusList?.map((status, index) => (
            <Draggable key={status.id}>
              <StatusRow key={status.id} status={status} index={index} />
            </Draggable>
          ))}
        </Container>
      </Collapse>
    </>
  )
}

export default StatusTypeRow
