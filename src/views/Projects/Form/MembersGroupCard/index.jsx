import { useState } from "react"
import { useParams } from "react-router-dom"
import FormCard from "../../../../components/FormCard"

import projectMembersGroupService from "../../../../services/projectMembersGroupService"
import { useEffect } from "react"
import GroupRow from "./GroupRow"
import TitleCreateForm from "../../../../components/CreateForms/TitleCreateForm"

const MembersGroupCard = () => {
  const { projectId } = useParams()

  const [groupsList, setGroupsList] = useState([])
  const [createLoader, setCreateLoader] = useState(false)
  const [loader, setLoader] = useState(true)
  const [createFormVisible, setCreateFormVisible] = useState(false)

  const closeCreateForm = () => setCreateFormVisible(false)

  const createGroup = ({ title }) => {
    setCreateLoader(true)

    const data = {
      project_id: projectId,
      title,
    }

    projectMembersGroupService
      .create(data)
      .then((res) => {
        setGroupsList((prev) => [...prev, res])
        closeCreateForm()
      })
      .finally(() => setCreateLoader(false))
  }

  const deleteGroup = (id) => {
    setGroupsList(prev => prev.filter(el => el.id !== id) ?? [])
  }

  const editGroup = (id, title) => {
    setGroupsList(prev => prev.map(group => {
      if(group.id !== id) return group
      return {
        ...group,
        title
      }
    }))
  }

  const getGroupsList = () => {
    setLoader(true)

    projectMembersGroupService
      .getList({
        "project-id": projectId,
      })
      .then((res) => setGroupsList(res.project_member_groups ?? []))
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getGroupsList()
  }, [])


  return (
    <div>
      <FormCard visible title="Groups for members">
        <div className="StatusGroup silver-bottom-border">
          <div className="status-list">
            {groupsList?.map((group) => (
              <GroupRow
                key={group.id}
                group={group}
                deleteGroup={deleteGroup}
                editGroup={editGroup}
              />
            ))}
          </div>

            <TitleCreateForm
              formVisible={createFormVisible}
              setFormVisible={setCreateFormVisible}
              loader={createLoader}
              onSubmit={createGroup}
              closeForm={closeCreateForm}
              title="Create new group"
            />
        </div>
      </FormCard>
    </div>
  )
}

export default MembersGroupCard
