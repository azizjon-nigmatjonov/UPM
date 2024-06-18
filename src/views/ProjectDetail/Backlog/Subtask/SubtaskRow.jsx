import { Checkbox, IconButton, MenuItem, Modal } from "@mui/material"
import { useState } from "react"
import CreateRow from "../CreateRow"
import { useDispatch } from "react-redux"
import "./style.scss"
import SubtaskModal from "./SubtaskModal"
import CBreadcrumbs from "../../../../components/CBreadcrumbs"
import {
  deleteSubtaskAction,
  updateGanttPositionsAction,
  updateSubtaskAction,
} from "../../../../redux/thunks/subtask.thunk"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import IconGenerator from "../../../../components/IconPicker/IconGenerator"
import { subtaskActions } from "../../../../redux/slices/subtask.slice"
import { deleteSubtaskFromSprintAction } from "../../../../redux/thunks/sprint.thunk"
import StatusTag from "../../../../components/StatusTag"
import {
  CopyIcon,
  EpicDeleteIcon,
  EpicEditIcon,
  WarningIcon,
} from "../../../../assets/icons/icons"
import CloseIcon from "@mui/icons-material/Close"

const SubtaskRow = ({
  subtask,
  disableEdit,
  sprintSubtask,
  statusEditDisable,
  sprintId,
  step,
  setSubtaskList,
  insideGantt,
  copyHandler,
  subLoader,
}) => {
  const dispatch = useDispatch()
  const statusList = useSelector((state) => state.status.list)
  const taskTypeList = useSelector((state) => state.taskType.list)
  const selectedSubtasks = useSelector(
    (state) => state.subtask.selectedSubtasks
  )

  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)
  const [formLoader, setFormLoader] = useState(false)
  const [selectedSubtask, setSelectedSubtask] = useState(null)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const openModal = () => setSelectedSubtask(subtask.id)
  const closeModal = () => setSelectedSubtask(null)

  const deleteHandler = () => {
    setLoader(true)
    if (sprintSubtask) {
      dispatch(
        deleteSubtaskFromSprintAction({
          sprintId,
          stepId: step.id,
          subtaskId: subtask.id,
        })
      ).then(() => setLoader(false))
    } else {
      dispatch(deleteSubtaskAction(subtask.id))
        .unwrap()
        .then(() => {
          if (insideGantt) dispatch(updateGanttPositionsAction())
        })
        .finally(() => setLoader(false))
    }
  }

  const updateHandler = ({ title}) => {
    const data = { ...subtask, title}
    setFormLoader(true)
    dispatch(updateSubtaskAction(data))
      .unwrap()
      .then(() => setTextFieldVisible(false))
      .finally(() => setFormLoader(false))
  }

  const onCheckboxChange = (_, val) => {
    if (val) dispatch(subtaskActions.addSelectedSubtasks([subtask.id]))
    else dispatch(subtaskActions.removeSelectedSubtasks([subtask.id]))
  }

  const isChecked = useMemo(() => {
    return selectedSubtasks.includes(subtask.id)
  }, [subtask.id, selectedSubtasks])

  const computedStatus = useMemo(() => {
    return statusList.find((el) => el.id === subtask.status_id)
  }, [statusList, subtask.status_id])

  const computedTaskType = useMemo(() => {
    return taskTypeList.find(
      (el) => el.id === computedStatus?.project_task_type_id
    )
  }, [computedStatus, taskTypeList])

  const breadCrumbItems = [
    { label: subtask.task_title },
    { label: subtask.stage_title },
  ]

  const openConfirm = () => setOpenConfirmModal(true)
  const closeConfirm = () => setOpenConfirmModal(false)

  return (
    <>
      {selectedSubtask && (
        <SubtaskModal
          closeModal={closeModal}
          step={step}
          subtask={subtask}
          sprintSubtask={sprintSubtask}
          disabled={statusEditDisable}
          insideGantt={insideGantt}
        />
      )}

      <Modal open={openConfirmModal} onClose={closeConfirm}>
        <div className="confirm_modal">
          <div className="confirm_warning">
            <WarningIcon />
          </div>
          <div className="confirm_modal_item">
            <div className="confirm_context">
              <h2>Вы уверены, что хотите удалить?</h2>
              <span
                onClick={() => {
                  closeConfirm()
                }}
              >
                <CloseIcon style={{ color: "#002266" }} />
              </span>
            </div>
            <div className="btns">
              <button className="btn_not_Confirm" onClick={closeConfirm}>
                Нет
              </button>
              <button
                className="btn_confirm"
                onClick={() => {
                  deleteHandler()
                  closeConfirm()
                }}
              >
                Да
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <MenuItem
        className={`SubtaskRow silver-bottom-border pointer drag-handler-btn ${insideGantt ? "drag-handler-btn" : ""}`}
        onClick={openModal}
      >
        {textFieldVisible ? (
          <CreateRow
            initialTitle={subtask.title}
            onSubmit={updateHandler}
            btnLoader={formLoader}
          />
        ) : (
          <>
            {!sprintSubtask && (
              <Checkbox
                checked={isChecked}
                onChange={onCheckboxChange}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <IconGenerator icon={computedTaskType?.icon} className="icon space-right" />
            { !insideGantt && <IconButton className="icon drag-handler-btn" color="warning">
              <DragIndicatorIcon />
            </IconButton>}
            <div className="label">
              {sprintSubtask && (
                <CBreadcrumbs size="small" items={breadCrumbItems} />
              )}
              {sprintSubtask ? subtask?.subtask_title : subtask?.title}
            </div>

            <div className="btns">
              {/* <TasksCounter element={subtask} /> */}
              <StatusTag statusId={subtask.status_id} />

              {(!disableEdit && !insideGantt) && (
                <button
                  className="epic_btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setTextFieldVisible(true)
                  }}
                >
                  <EpicEditIcon />
                </button>
              )}
              {(!disableEdit && !insideGantt)  && (
                <button
                  className="epic_btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyHandler(subtask.id)
                  }}
                >
                  <CopyIcon />
                </button>
              )}
              {(!disableEdit && !insideGantt) && (
                <button
                  className="epic_delete_btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    openConfirm()
                  }}
                >
                  <EpicDeleteIcon />
                </button>
              )}
            </div>
          </>
        )}
      </MenuItem>
    </>
  )
}

export default SubtaskRow
