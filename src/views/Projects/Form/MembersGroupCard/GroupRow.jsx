import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import { Edit, Delete } from "@mui/icons-material"
import { useState } from "react"
import statusService from "../../../../services/statusService"
import TitleCreateForm from "../../../../components/CreateForms/TitleCreateForm"
import projectMembersGroupService from "../../../../services/projectMembersGroupService"

const GroupRow = ({ group, deleteGroup, editGroup }) => {
  const [editFormVisible, setEditFormVisible] = useState(false)
  const [loader, setLoader] = useState()

  const deleteHandler = () => {
    setLoader(true)
    projectMembersGroupService
      .delete(group.id)
      .then((res) => deleteGroup(group.id))
      .catch(() => setLoader(false))
  }

  const updateHandler = (data) => {
    setLoader(true)
    projectMembersGroupService
      .update(data)
      .then((res) => {
        editGroup(group.id, data.title)
        setEditFormVisible(false)
      })
      .finally(() => setLoader(false))
  }

  if (editFormVisible)
    return (
      <TitleCreateForm
        formVisible={editFormVisible}
        setFormVisible={setEditFormVisible}
        onSubmit={updateHandler}
        initialValues={group}
      />
    )

  return (
    <div className="GroupRow row">
      <div className="title-block">{group.title}</div>

      <RectangleIconButton
        color="primary"
        onClick={() => setEditFormVisible(true)}
      >
        <Edit color="primary" />
      </RectangleIconButton>

      <RectangleIconButton
        color="error"
        loader={loader}
        onClick={deleteHandler}
      >
        <Delete color="error" />
      </RectangleIconButton>
    </div>
  )
}

export default GroupRow
