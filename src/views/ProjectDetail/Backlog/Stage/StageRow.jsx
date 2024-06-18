import {
  Checkbox,
  Collapse,
  IconButton,
  MenuItem,
  Modal,
} from "@mui/material"
import { useState } from "react"
import CreateRow from "../CreateRow"
import CreateRowButton from "../../../../components/CreateRowButton"
import TasksCounter from "../../../../components/TasksCounter"
import { Container, Draggable } from "react-smooth-dnd"
import { applyDrag } from "../../../../utils/applyDrag"
import { useDispatch, useSelector } from "react-redux"
import { useMemo } from "react"
import "./style.scss"
import {
  deleteStageAction,
  updateStageAction,
} from "../../../../redux/thunks/stage.thunk"
import SubtaskRow from "../Subtask/SubtaskRow"
import {
  createNewSubtaskAction,
  updateGanttPositionsAction,
  updateSubtaskOrderAction,
} from "../../../../redux/thunks/subtask.thunk"
import { useParams } from "react-router-dom"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { stageActions } from "../../../../redux/slices/stage.slice"
import IconGenerator from "../../../../components/IconPicker/IconGenerator"
import { subtaskActions } from "../../../../redux/slices/subtask.slice"
import subtaskCopyService from "../../../../services//subtaskCopyServices"
import { EpicDeleteIcon, EpicEditIcon, WarningIcon } from "../../../../assets/icons/icons"
import CloseIcon from "@mui/icons-material/Close"

const StageRow = ({ stage, index, disableEdit, taskTitle, insideGantt }) => {
  const { projectId } = useParams()
  const dispatch = useDispatch()

  const openedStages = useSelector((state) => state.stage.openedStages)
  const allSubtaskList = useSelector((state) => state.subtask.list)
  const selectedSubtasks = useSelector(
    (state) => state.subtask.selectedSubtasks
  )

  const [loader, setLoader] = useState(false)
  const [textFieldVisible, setTextFieldVisible] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [createLoader, setCreateLoader] = useState(false)
  const [subLoader, setSubLoader] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const childBlockVisible = useMemo(() => {
    return openedStages.includes(stage.id)
  }, [openedStages, stage.id])

  const subtaskList = useMemo(() => {
    return (
      allSubtaskList.filter((subtask) => subtask.stage_id === stage.id) ?? []
    )
  }, [allSubtaskList, stage.id])

  const isChecked = useMemo(() => {
    return (
      subtaskList?.length &&
      !subtaskList.some((el) => !selectedSubtasks.includes(el.id))
    )
  }, [subtaskList, selectedSubtasks])

  // ----------STAGE ACTIONS----------------

  const deleteHandler = () => {
    setLoader(true)
    dispatch(
      deleteStageAction({ stageId: stage.id, taskId: stage.task_id })
    ).then(() => setLoader(false))
  }

  const updateHandler = ({ title }) => {
    const data = { ...stage, title }

    setCreateLoader(true)
    dispatch(updateStageAction(data))
      .unwrap()
      .then(() => setTextFieldVisible(false))
      .finally(() => setCreateLoader(false))
  }

  // --------STAGE SUBTASK ACTIONS---------------------

  const switchChildBlockVisible = () => {
    if (childBlockVisible)
      return dispatch(stageActions.removeOpenedStages(stage.id))
    dispatch(stageActions.addOpenedStages(stage.id))
  }

  const createSubtask = ({ title }) => {
    const data = {
      project_id: projectId,
      task_id: stage.task_id,
      stage_id: stage.id,
      title,
    }

    setCreateLoader(true)
    dispatch(createNewSubtaskAction(data))
      .unwrap()
      .then((res) => {
        setCreateFormVisible(false)
        dispatch(updateGanttPositionsAction())
        dispatch(stageActions.addOpenedStages(stage.id))
      })
      .catch(() => setCreateLoader(false))
  }

  const onDrop = (dropResult) => {
    const result = applyDrag(subtaskList, dropResult)
    if (result?.length === subtaskList?.length) {
      dispatch(
        updateSubtaskOrderAction({
          ...dropResult,
          list: result,
          id: subtaskList[dropResult.removedIndex].id,
        })
      )
    }
  }

  const onCheckboxChange = (_, val) => {
    if (val)
      dispatch(
        subtaskActions.addSelectedSubtasks(subtaskList?.map((el) => el.id))
      )
    else
      dispatch(
        subtaskActions.removeSelectedSubtasks(subtaskList?.map((el) => el.id))
      )
  }

  const copyHandler = (id) => {
    setSubLoader(true)
    subtaskCopyService
      .post(id)
      .then((res) => {
        dispatch(subtaskActions.addSubtask(res))
        // console.log('res', res);
      })
      .catch((err) => console.log("err", err))
      .finally((res) => setSubLoader(false))
  }

  const openConfirm = () => setOpenConfirmModal(true)
  const closeConfirm = () => setOpenConfirmModal(false)

  return (
    <>
      <MenuItem
        className={`StageRow silver-bottom-border pointer drag-handler-btn ${insideGantt ? "drag-handler-btn" : ""}`}
        onClick={switchChildBlockVisible}
      >
        {textFieldVisible ? (
          <CreateRow
            initialTitle={stage.title}
            onSubmit={updateHandler}
            btnLoader={createLoader}
          />
        ) : (
          <>
            <Checkbox
              checked={isChecked}
              onChange={onCheckboxChange}
              onClick={(e) => e.stopPropagation()}
            />
            <IconGenerator icon={stage.icon} className="icon space-right" />
            {!insideGantt && <IconButton className="icon drag-handler-btn">
              <DragIndicatorIcon />
            </IconButton>}
            <div className="label">{stage.title}</div>

            <div className="btns">
              <TasksCounter element={stage} isStage />
              {(!disableEdit && !insideGantt) && (
                <CreateRowButton
                  formVisible={createFormVisible}
                  setFunction={setCreateFormVisible}
                />
              )}

              {(!disableEdit && !insideGantt) && (
                <button
                  className="epic_btn"
                  onClick={() => setTextFieldVisible(true)}
                >
                  <EpicEditIcon />
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

      <Collapse
        in={createFormVisible}
        className="silver-bottom-border"
        unmountOnExit
      >
        <CreateRow
          onSubmit={createSubtask}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
        />
      </Collapse>

      <Collapse in={childBlockVisible && !textFieldVisible} unmountOnExit>
        <Container
          onDrop={onDrop}
          groupName="1"
          behaviour="move"
          dragHandleSelector=".drag-handler-btn"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
          getChildPayload={(i) => ({
            ...subtaskList[i],
            stage_title: stage.title,
            task_title: taskTitle,
          })}
        >
          {subtaskList?.map((subtask, index) => (
            <Draggable key={subtask.id}>
              <SubtaskRow
                key={subtask.id}
                subtask={subtask}
                index={index}
                disableEdit={disableEdit}
                insideGantt={insideGantt}
                copyHandler={copyHandler}
                subLoader={subLoader}
              />
            </Draggable>
          ))}
        </Container>
      </Collapse>
    </>
  )
}

export default StageRow
