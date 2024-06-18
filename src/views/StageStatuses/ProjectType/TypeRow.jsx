import { Edit, Delete } from "@mui/icons-material"
import { useState } from "react"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import ColorPicker from "../../../components/ColorPicker"
import TitleCreateForm from "../../../components/CreateForms/TitleCreateForm"
import projectService from "../../../services/projectService"

const TypeRow = ({ type, getProjectTypes = () => {} }) => {
  const [editFormVisible, setEditFormVisible] = useState(false)
  const [loader, setLoader] = useState(false)
  const [deleteLoader, setDeleteLoader] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)

  const updateHandler = (data) => {
    setLoader(true)

    projectService
      .updateProjectType({ ...type, ...data })
      .then((res) => {
        getProjectTypes()
        setEditFormVisible(false)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoader(false))
  }

  const deleteHandler = (taskId) => {
    setDeleteLoader(true)

    projectService
      .deleteProjectType(taskId)
      .then((res) => {
        getProjectTypes()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setDeleteLoader(false))
  }

  const titleUpdateHandler = ({ title }) => {
    updateHandler(title)
  }

  const colorChangeHandler = (color) => {
    updateHandler({ color })
  }

  if (editFormVisible)
    return (
      <TitleCreateForm
        formVisible={editFormVisible}
        setFormVisible={setEditFormVisible}
        onSubmit={titleUpdateHandler}
        initialValues={type || {}}
        loader={loader}
      />
    )

  return (
    <div className="GroupRow row">
      <ColorPicker
        onChange={colorChangeHandler}
        value={type.color}
        loading={createLoader}
      />
      <div className="title-block">{type.title || ""}</div>
      <RectangleIconButton
        color="primary"
        onClick={() => setEditFormVisible(true)}
      >
        <Edit color="primary" />
      </RectangleIconButton>

      <RectangleIconButton
        color="error"
        loader={deleteLoader}
        onClick={() => deleteHandler(type.id)}
      >
        <Delete color="error" />
      </RectangleIconButton>
    </div>
  )
}

export default TypeRow
