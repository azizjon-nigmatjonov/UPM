import { createAsyncThunk } from "@reduxjs/toolkit"
import taskService from "../../services/taskService"
import { sortByOrderNumber } from "../../utils/sortByOrderNumber"
import { stageActions } from "../slices/stage.slice"
import { subtaskActions } from "../slices/subtask.slice"
import { taskActions } from "../slices/task.slice"
import { calculateEpicTimesAction } from "./epic.thunk"

export const getTaskListInsideEpicAction = createAsyncThunk(
  "task/getTaskListInsideEpic",
  async (id, { dispatch }) => {
    try {
      const res = await taskService.getListInsideEpic(id)
      
      dispatch(stageActions.setList(res.stages?.sort(sortByOrderNumber) ?? []))
      dispatch(
        subtaskActions.setList(
          res.subtasks
            ?.map((el) => ({ ...el, epic_id: id }))
            .sort(sortByOrderNumber) ?? []
        )
      )
      
      return res.tasks?.sort(sortByOrderNumber) ?? []
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const createNewTaskAction = createAsyncThunk(
  "task/createNewTask",
  async ({ data, haveList }, { getState, dispatch }) => {
    try {
      const state = getState()

      const computedData = {
        ...data,
        status_id: state.project.info.default_status,
        version_id: state.version.selectedVersionId,
        creator_id: state.auth.userInfo.id,
      }

      const res = await taskService.create(computedData)

      if (!haveList) await dispatch(getTaskListInsideEpicAction(data.epic_id))
      else {
        dispatch(
          stageActions.setList(
            res.stage_items?.map((el) => ({ ...el, task_id: res.id })) ?? []
          )
        )
        return res
      }
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateTaskOrderAction = createAsyncThunk(
  "task/updateTaskOrder",
  async ({ list, id, addedIndex }, { getState, dispatch, rejectWithValue }) => {
    const state = getState()
    const listPrevValue = state.task.list
    dispatch(taskActions.setList(list))

    try {
      await taskService.updateOrder(id, addedIndex + 1)
      return list
    } catch (error) {
      rejectWithValue(listPrevValue)
    }
  }
)

export const deleteTaskAction = createAsyncThunk(
  "task/deleteTask",
  async (id) => {
    try {
      await taskService.delete(id)

      return id
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateTaskAction = createAsyncThunk(
  "task/updateTask",
  async (newData, { getState }) => {
    try {
      await taskService.update(newData)

      return newData
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const editGanttTaskPosisitonAction = createAsyncThunk(
  "task/editGanttTaskPosisiton",
  async ({beginIndex, endIndex, task}, { getState, dispatch }) => {

    const indexedDates = getState().gantt.indexedDates

    const beginDate = indexedDates[beginIndex] ?? indexedDates[0]
    const endDate = indexedDates[endIndex]

    const computedData = {
      ...task,
      start_time: beginDate,
      end_time: endDate,
      expectedStartIndex: beginIndex,
      expectedEndIndex: endIndex
    }

    dispatch(taskActions.edit(computedData))
    dispatch(calculateEpicTimesAction(task.epic_id))
    
    try {
      await taskService.updateTime(task.id, {
        start_time: computedData.start_time,
        end_time: computedData.end_time
      })

    } catch (error) {
      throw new Error(error)
    }
  }
)