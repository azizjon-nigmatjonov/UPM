import { createAsyncThunk } from "@reduxjs/toolkit"
import projectTaskTypeService from "../../services/projectTaskTypeService"
import { sortByOrderNumber } from "../../utils/sortByOrderNumber"
import { taskTypeActions } from "../slices/taskType.slice"

export const getTaskTypeListAction = createAsyncThunk(
  "taskType/getTaskTypeList",
  async (projectId) => {
    try {
      const res = await projectTaskTypeService.getList({
        project_id: projectId,
      })
      return res.projectTaskTypes?.sort(sortByOrderNumber)
    } catch (error) {
      throw new Error()
    }
  }
)

export const createNewTaskTypeAction = createAsyncThunk(
  "taskType/createNewTaskType",
  async (data) => {
    try {
      const res = await projectTaskTypeService.create(data)

      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateTaskTypeOrderAction = createAsyncThunk(
  "taskType/updateTaskTypeOrder",
  async (
    { list, removedIndex, addedIndex, id },
    { getState, dispatch, rejectWithValue }
  ) => {
    dispatch(taskTypeActions.setList(list))

    try {
      projectTaskTypeService.updateOrder(
        id,
        addedIndex + 1
      )
      return list
    } catch (error) {
      console.log('error', error);
    }
  }
)

export const deleteTaskTypeAction = createAsyncThunk(
  "taskType/deleteTaskType",
  async (id) => {
    try {
      await projectTaskTypeService.delete(id)

      return id
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateTaskTypeAction = createAsyncThunk(
  "taskType/updateTaskType",
  async (newData) => {
    try {
      await projectTaskTypeService.update(newData)

      return newData
    } catch (error) {
      throw new Error(error)
    }
  }
)

// DEFAULTS

export const getDefaultTaskTypeListAction = createAsyncThunk(
  "taskType/getDefaultTaskTypeList",
  async () => {
    try {
      const res = await projectTaskTypeService.getDefaults()

      return res?.items?.sort(sortByOrderNumber)
    } catch (error) {
      throw new Error()
    }
  }
)

export const createDefaultTaskTypeAction = createAsyncThunk(
  "taskType/createDefaultTaskType",
  async (data) => {
    try {
      const res = await projectTaskTypeService.createDefault(data)

      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateDefaultTaskTypeOrderAction = createAsyncThunk(
  "taskType/updateDefaultTaskTypeOrder",
  async (
    { list, removedAction, addedIndex },
    { getState, dispatch, rejectWithValue }
  ) => {
    dispatch(taskTypeActions.setDefaultList(list))

    try {
    } catch (error) {
      throw new Error()
    }
  }
)

export const deleteDefaultTaskTypeAction = createAsyncThunk(
  "taskType/deleteDefaultTaskType",
  async (id) => {
    try {
      await projectTaskTypeService.deleteDefault(id)

      return id
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateDefaultTaskTypeAction = createAsyncThunk(
  "taskType/updateDefaultTaskType",
  async (newData) => {
    try {
      await projectTaskTypeService.updateDefault(newData)

      return newData
    } catch (error) {
      throw new Error(error)
    }
  }
)
