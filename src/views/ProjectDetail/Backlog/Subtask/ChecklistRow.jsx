import { Checkbox, MenuItem, Skeleton } from "@mui/material"
import { useState, useEffect } from "react"
import ButtonsPopover from "../../../../components/ButtonsPopover"
import checklistService from "../../../../services/checklistService"
import CreateRow from "../CreateRow"

const ChecklistRow = ({ index, checklistItem, subtaskId, setChecklist }) => {
  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)
  const [checkboxLoader, setCheckboxLoader] = useState(false)
  const [checkboxStatus, setCheckboxStatus] = useState(false)
  
  const deleteChecklist = () => {
    setLoader(true)

    checklistService
      .delete(subtaskId, checklistItem.id)
      .then((res) => {
        setChecklist((prev) => prev?.filter((el) => el.id !== checklistItem.id))
      })
      .catch(() => setLoader(false))
  }

  const updateChecklistTitle = ({ title }) => {
    setLoader(true)

    
    const data = {
      ...checklistItem,
      subtask_id: subtaskId,
      title,
      status: checklistItem.status ? "DONE" : "NOT_DONE",
    }
    
    checklistService
      .update(data)
      .then((res) => {
        setChecklist((prev) =>
          prev?.map((el) => {
            if (el.id !== checklistItem.id) return el
            return {
              ...checklistItem,
              title
            }
          })
        )
        setTextFieldVisible(false)
      })
      .finally(() => setLoader(false))
  }

  const updateChecklistStatus = (status) => {
    setCheckboxLoader(true)

    const data = {
      ...checklistItem,
      subtask_id: subtaskId,
      status: status ? "DONE" : "NOT_DONE",
    }
    
    checklistService
      .update(data)
      .then((res) => {
        setChecklist((prev) =>
          prev?.map((el) => {
            if (el.id !== checklistItem.id) return el
            return {
              ...checklistItem,
              status: status,
            }
          })
        )
      })
      .finally(() => setCheckboxLoader(false))
  }

  return (
    <MenuItem className="checklist-row">
      {textFieldVisible ? (
        <div style={{ width: "calc(100% - 40px)" }}>
          <CreateRow
            initialTitle={checklistItem.title}
            onSubmit={updateChecklistTitle}
            loader={loader}
          />
        </div>
      ) : (
        <>
          <Checkbox
            checked={checklistItem?.status}
            onChange={(_, val) => updateChecklistStatus(val)}
          />
          <div className="label">
            {index + 1}. {checklistItem.title}
          </div>
          <ButtonsPopover
            onDeleteClick={deleteChecklist}
            onEditClick={() => setTextFieldVisible(true)}
            loading={loader}
          />
        </>
      )}
    </MenuItem>
  )
}

export default ChecklistRow
