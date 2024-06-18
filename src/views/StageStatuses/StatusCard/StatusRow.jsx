import { IconButton } from "@mui/material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { Delete, Edit } from "@mui/icons-material"
import RowLinearLoader from "../../../components/RowLinearLoader"
import CreateRowButton from "../../../components/CreateRowButton"
import CreateRow from "../../ProjectDetail/Backlog/CreateRow"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import ColorPicker from "../../../components/ColorPicker"
import {
  deleteStatusAction,
  updateStatusAction,
} from "../../../redux/thunks/status.thunk"

const StatusRow = ({ status }) => {
  const dispatch = useDispatch()

  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)
  const [linearLoader, setLinearLoader] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)

  const deleteHandler = () => {
    setLoader(true)
    dispatch(deleteStatusAction(status.id)).then(() => setLoader(false))
  }

  const updateHandler = (value) => {
    const data = { ...status, ...value }

    setCreateLoader(true)
    dispatch(updateStatusAction(data))
      .unwrap()
      .then(() => setTextFieldVisible(false))
      .finally(() => setCreateLoader(false))
  }

  const colorChangeHandler = (color) => {
    updateHandler({ color })
  }

  return (
    <>
      <div className="StatusRow silver-bottom-border pointer">
        {textFieldVisible ? (
          <CreateRow
            initialTitle={status.title}
            onSubmit={updateHandler}
            btnLoader={createLoader}
          />
        ) : (
          <>
            <ColorPicker
              onChange={colorChangeHandler}
              value={status.color}
              loading={createLoader}
            />
            <IconButton className="drag-icon drag-handler-btn" color="primary">
              <DragIndicatorIcon />
            </IconButton>
            <div className="label">{status.title}</div>

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
      </div>
    </>
  )
}

export default StatusRow
