import { Collapse, IconButton, MenuItem } from "@mui/material"
import { useMemo, useState } from "react"
import CreateRowButton from "../../../components/CreateRowButton"
import { useDispatch, useSelector } from "react-redux"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import CreateRow from "../../ProjectDetail/Backlog/CreateRow"
import CollapseIcon from "../../../components/CollapseIcon"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import { Delete, Edit } from "@mui/icons-material"
import {
  deleteStatusTypeAction,
  updateStatusTypeAction,
} from "../../../redux/thunks/statusType.thunk"
import { createNewStatusAction, updateStatusOrderAction } from "../../../redux/thunks/status.thunk"
import { Draggable, Container } from "react-smooth-dnd"
import StatusRow from "./StatusRow"
import StatusTypeCreateRow from "./StatusTypeCreateRow"
import RowLinearLoader from "../../../components/RowLinearLoader"
import { applyDrag } from "../../../utils/applyDrag"

const StatusTypeRow = ({ statusType }) => {
  const dispatch = useDispatch()
  const allStatusList = useSelector((state) => state.status.list)
  const [loader, setLoader] = useState(false)
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

  const deleteHandler = () => {
    setLoader(true)
    dispatch(deleteStatusTypeAction(statusType.id)).then(() =>
      setLoader(false)
    )
  }

  const updateHandler = ({ title, state }) => {
    const data = { ...statusType, title, state }

    setCreateLoader(true)
    dispatch(updateStatusTypeAction(data))
      .unwrap()
      .then(() => setTextFieldVisible(false))
      .finally(() => setCreateLoader(false))
  }

  const openChildBlock = () => {
    setChildBlockVisible(true)
  }

  const switchChildBlockVisible = () => {
    if (!childBlockVisible) return openChildBlock()
    setChildBlockVisible(false)
  }

  const createStatus = ({ title }) => {
    console.log('statusType', statusType);
    const data = {
      project_task_type_id: statusType.project_task_type_id,
      status_group_id: statusType.id,
      state: statusType.state || 0,
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

  const onDrop = (dropResult) => {
    const result = applyDrag(statusList, dropResult)
    if (result) {
      dispatch(
        updateStatusOrderAction({
          ...dropResult,
          list: result,
          id: statusList[dropResult.removedIndex].id,
        })
      )
    }
  }

  return (
    <>
      <MenuItem
        className="StatusTypeRow silver-bottom-border pointer"
        onClick={switchChildBlockVisible}
      >
        {textFieldVisible ? (
          <StatusTypeCreateRow
            initialValues={statusType}
            onSubmit={updateHandler}
            btnLoader={createLoader}
          />
        ) : (
          <>
            <CollapseIcon fill="#0E73F6" isOpen={childBlockVisible} />
            <IconButton className="drag-icon drag-handler-btn" color="primary">
              <DragIndicatorIcon />
            </IconButton>
            <div className="label">{statusType.title}</div>

            <div className="btns">
              <CreateRowButton
                formVisible={createFormVisible}
                setFunction={setCreateFormVisible}
                type="rectangle"
              />

              <RectangleIconButton
                onClick={() => setTextFieldVisible(true)}
                color="primary"
              >
                <Edit color="primary" />
              </RectangleIconButton>
              <RectangleIconButton
                onClick={deleteHandler}
                loader={loader}
                color="error"
              >
                <Delete color="error" />
              </RectangleIconButton>
            </div>
          </>
        )}

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
          onDrop={onDrop}
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
