import { IconButton } from "@mui/material"
import CreateRowButton from "../../../components/CreateRowButton"
import AddIcon from "@mui/icons-material/Add"
import StatusCreateCard from "./StatusCreateCard"
import { useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import statusService from "../../../services/statusService"
import { useDispatch } from "react-redux"
import { projectActions } from "../../../redux/slices/project.slice"

const CreateColumns = () => {
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const dispatch = useDispatch()


  const createNewStatus = (data) => {
    statusService.create(data)
      .then(res => {
        dispatch(projectActions.addStatus(res))
        setCreateFormVisible(false)
      })
  }


  return (
    <div className="CreateColumns main">
      <div
        className="column-header card"
        onClick={() => setCreateFormVisible((prev) => !prev)}
      >
        <div className="side">
          {createFormVisible ? <>
            <CloseIcon color="error" />
            <div className="title cancel">CANCEL</div>
          </> : <>
            <AddIcon color="primary" />
            <div className="title">ADD NEW STATUS</div>
          </>}
        </div>
        <div className="side" />
      </div>

      {createFormVisible && <StatusCreateCard onSubmit={createNewStatus} />}
    </div>
  )
}

export default CreateColumns
