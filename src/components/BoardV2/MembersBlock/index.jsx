import { TextField } from "@mui/material"
import { useMemo, useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import projectMembersService from "../../../services/projectMembersService"
import subtaskService from "../../../services/subtaskService"
import RowLinearLoader from "../../RowLinearLoader"
import UserAvatar from "../UserAvatar"
import UsersRow from "../UsersRow"
import OutsideClickHandler from "react-outside-click-handler"
import "./style.scss"
import { useSelector, useDispatch } from "react-redux"
import { taskTypeActions } from "../../../redux/slices/taskType.slice"

const MembersBlock = ({ subtaskId, assigneeUsers = [], setAssigneeUsers }) => {
  const { projectId } = useParams()
  const dispatch = useDispatch()
  const [projectMembersList, setProjectMembersList] = useState([])
  const [searchText, setSearchText] = useState("")
  const [loader, setLoader] = useState(true)
  const membersRef = useRef()
  const isAddMemberMenuOpen = useSelector((state) => state.taskType.isAddMemberMenuOpen);
  const textFieldRef = useRef(null)

  const fetchProjectMembersList = () => {
    setLoader(true)
    projectMembersService
      .getList({ 'project-id': projectId })
      .then((res) => setProjectMembersList(res.project_members))
      .finally(() => setLoader(false))
  }

  const computedProjectMembersList = useMemo(() => {
    const selectedIDs = assigneeUsers.map((el) => el.id)

    return projectMembersList.map((member) => ({
      ...member,
      isSelected: selectedIDs.includes(member.user?.id),
    }))
  }, [projectMembersList, assigneeUsers])

  const foundMembers = useMemo(() => {
    if (!searchText) return []
    return computedProjectMembersList.filter((member) =>
      member?.user?.name?.toLowerCase()?.includes(searchText?.toLowerCase()) || member?.user?.email?.toLowerCase()?.includes(searchText?.toLowerCase())
    )
  }, [searchText, computedProjectMembersList])

  const memberClickHandler = (member) => {
    let computedUsersList = []
    if (member.isSelected) {
      computedUsersList = assigneeUsers.filter(
        (user) => user.id !== member.user.id
      )
    } else {
      computedUsersList = [...assigneeUsers, member.user]
    }

    setLoader(true)
    const data = {
      subtask_id: subtaskId,
      user_ids: computedUsersList.map((el) => el.id),
    }

    subtaskService
      .updateAssigneeUsers(data)
      .then((res) => {
        setAssigneeUsers(computedUsersList)
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    fetchProjectMembersList()
  }, [])

  const openContextBlock = () => {
    dispatch(taskTypeActions.setIsAddMemberMenuOpen(!isAddMemberMenuOpen))
  }

  const closeContextBlock = () => {
    dispatch(taskTypeActions.setIsAddMemberMenuOpen(!isAddMemberMenuOpen))
  }

  useEffect(() => {
    if (isAddMemberMenuOpen) textFieldRef?.current?.focus()
  }, [isAddMemberMenuOpen, textFieldRef])

  return (
    <div className="MembersBlockNew">
      <UsersRow
        onAddButtonClick={openContextBlock}
        assigneeUsers={assigneeUsers}
      />

      {isAddMemberMenuOpen && (
        <OutsideClickHandler onOutsideClick={closeContextBlock}>
          <div ref={membersRef} className="context-block">
            <div className="header silver-bottom-border">
              Members <RowLinearLoader visible={loader} />{" "}
            </div>

            <TextField
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              size="small"
              fullWidth
              placeholder="Search member"
              inputRef={textFieldRef}
            />

            <p className="title">Members</p>

            {searchText ? (
              <div className="found-members-block">
                {foundMembers.map((member) => (
                  <div
                    className="row"
                    onClick={() => memberClickHandler(member)}
                  >
                    <UserAvatar
                      user={member.user}
                      isSelected={member.isSelected}
                    />
                    <div className="name">{member.user?.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="selected-members-block">
                {computedProjectMembersList.map((member) => (
                  <UserAvatar
                    onClick={() => memberClickHandler(member)}
                    key={member.id}
                    user={member?.user}
                    isSelected={member.isSelected}
                  />
                ))}
              </div>
            )}
          </div>
        </OutsideClickHandler>
      )}
    </div>
  )
}

export default MembersBlock
