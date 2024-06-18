import { createAsyncThunk } from "@reduxjs/toolkit"
import epicsService from "../../services/epicsService"
import statusService from "../../services/statusService"
import { sortByOrderNumber } from "../../utils/sortByOrderNumber"
import { epicActions } from "../slices/epic.slice"
import { statusActions } from "../slices/status.slice"

export const getStatusListAction = createAsyncThunk(
  "status/getStatusList",
  async (projectId, { getState }) => {
    try {
      const res = await statusService.getList(projectId)

      return res.statuses?.sort(sortByOrderNumber) ?? []
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const createNewStatusAction = createAsyncThunk(
  "status/createNewStatus",
  async (data, { getState }) => {
    try {
      const res = await statusService.create(data)
      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateStatusOrderAction = createAsyncThunk(
  "status/updateStatusOrder",
  async (
    { list, removedIndex, addedIndex, id },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState()
    const listPrevValue = state.epic.list
    dispatch(epicActions.setList(list))
    dispatch(statusActions.setList(list))


    try {
      await statusService.updateOrder(
        id,
        addedIndex + 1,
      )
      await epicsService.updateOrder(
        id,
        addedIndex + 1,
      )
      return list
    } catch (error) {
      rejectWithValue(listPrevValue)
    }
  }
)

export const deleteStatusAction = createAsyncThunk(
  "status/deleteStatus",
  async (id, { getState }) => {
    try {
      await statusService.delete(id)

      return id
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateStatusAction = createAsyncThunk(
  "status/updateStatus",
  async (data, { getState }) => {
    try {
      await statusService.update(data)

      return data
    } catch (error) {
      throw new Error(error)
    }
  }
)

// DEFAULTS

export const getDefaultStatusListAction = createAsyncThunk(
  "status/getDefaultStatusList",
  async (statusGroupId, { getState }) => {
    try {
      const res = await statusService.getDefaultList(statusGroupId)
      return res.items?.sort(sortByOrderNumber) ?? []
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const createNewDefaultStatusAction = createAsyncThunk(
  "status/createNewDefaultStatus",
  async (data, { getState }) => {
    try {
      const res = await statusService.createDefault(data)
      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateDefaultStatusOrderAction = createAsyncThunk(
  "status/updateDefaultStatusOrder",
  async (
    { list, removedIndex, addedIndex },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState()
    const listPrevValue = state.status.defaultList
    dispatch(epicActions.setDefaultList(list))

    try {
      await statusService.updateDefaultOrder(
        listPrevValue[removedIndex].id,
        addedIndex + 1
      )
      return list
    } catch (error) {
      rejectWithValue(listPrevValue)
    }
  }
)

export const deleteDefaultStatusAction = createAsyncThunk(
  "status/deleteDefaultStatus",
  async (id, { getState }) => {
    await statusService.deleteDefault(id)

    return id
  }
)

export const updateDefaultStatusAction = createAsyncThunk(
  "status/updateDefaultStatus",
  async (data, { getState }) => {
    await statusService.updateDefault(data)

    return data
  }
)
