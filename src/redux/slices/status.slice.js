import { createSlice } from "@reduxjs/toolkit"
import {
  createNewStatusAction,
  deleteStatusAction,
  getStatusListAction,
  updateStatusAction,
  updateStatusOrderAction,
  getDefaultStatusListAction,
  createNewDefaultStatusAction,
  updateDefaultStatusOrderAction,
  deleteDefaultStatusAction,
  updateDefaultStatusAction,
} from "../thunks/status.thunk"

const initialState = {
  list: [],
  defaultList: [],
}

export const { actions: statusActions, reducer: statusReducer } = createSlice({
  name: "status",
  initialState,
  reducers: {
    setList(state, { payload }) {
      state.list = payload ?? []
    },
    setDefaultList(state, { payload }) {
      state.defaultList = payload ?? []
    },
    changeOrders(state, { payload }) {
      state.list = [
        ...state.list.filter((el) => !payload.some((el2) => el2.id === el.id)),
        ...payload,
      ]
    },
    reset() {
      return initialState
    },
  },
  extraReducers: {
    [getStatusListAction.fulfilled]: (state, { payload }) => {
      state.list = payload ?? []
      state.loader = false
    },
    [createNewStatusAction.fulfilled]: (state, { payload }) => {
      state.list.push(payload)
    },
    [deleteStatusAction.fulfilled]: (state, { payload }) => {
      state.list = state.list.filter((el) => el.id !== payload)
    },
    [updateStatusAction.fulfilled]: (state, { payload }) => {
      const selectedEpicIndex = state.list.findIndex(
        (epic) => epic.id === payload.id
      )
      if (selectedEpicIndex !== -1) {
        state.list[selectedEpicIndex] = payload
      }
    },
    [updateStatusOrderAction.rejected]: (state, { payload }) => {
      state.list = payload
    },
    // DEFAULT
    [getDefaultStatusListAction.fulfilled]: (state, { payload }) => {
      state.defaultList = payload ?? []
    },
    [createNewDefaultStatusAction.fulfilled]: (state, { payload }) => {
      state.defaultList.push(payload)
    },
    [deleteDefaultStatusAction.fulfilled]: (state, { payload }) => {
      state.defaultList = state.defaultList.filter((el) => el.id !== payload)
    },
    [updateDefaultStatusAction.fulfilled]: (state, { payload }) => {
      const selectedEpicIndex = state.defaultList.findIndex(
        (epic) => epic.id === payload.id
      )
      if (selectedEpicIndex !== -1) {
        state.defaultList[selectedEpicIndex] = payload
      }
    },
    [updateDefaultStatusOrderAction.rejected]: (state, { payload }) => {
      state.defaultList = payload
    },
  },
})
