import { createAsyncThunk } from "@reduxjs/toolkit"
import stageService from "../../services/stageService"
import { stageActions } from "../slices/stage.slice"


export const createNewStageAction = createAsyncThunk(
  "stage/createNewStage",
  async (data, { getState }) => {
    try {
      const state = getState()

      const computedData = {
        ...data,
        status_id: state.project.info.default_status,
      }

      const res = await stageService.create(computedData)

      return {
        ...res,
        ...computedData
      }
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateStageOrderAction = createAsyncThunk(
  "stage/updateStageOrder",
  async (
    { list, id, taskId, addedIndex },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState()
    const listPrevValue = state.task.list
    dispatch(stageActions.setList(list))

    try {
      await stageService.updateOrder(
        id,
        addedIndex + 1,
        taskId
      )
      return list
    } catch (error) {
      rejectWithValue(listPrevValue)
    }
  }
)

export const deleteStageAction = createAsyncThunk(
  "stage/deleteStage",
  async ({ stageId, taskId }) => {
    try {
      await stageService.delete(stageId, taskId)

      return stageId
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateStageAction = createAsyncThunk(
  "stage/updateStage",
  async (newData, { getState }) => {
    try {

      await stageService.update(newData)

      return newData
    } catch (error) {
      throw new Error(error)
    }
  }
)



