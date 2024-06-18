import { createSlice } from "@reduxjs/toolkit"
import {
  createNewTaskTypeAction,
  deleteTaskTypeAction,
  getTaskTypeListAction,
  updateTaskTypeAction,
  createDefaultTaskTypeAction,
  updateDefaultTaskTypeAction,
  getDefaultTaskTypeListAction,
  deleteDefaultTaskTypeAction,
} from "../thunks/taskType.thunk"

const initialState = {
  list: [],
  defaultList: [],
  isAddMemberMenuOpen: false,
  isCheckListMenuOpen: false
}

export const { actions: taskTypeActions, reducer: taskTypeReducer } =
  createSlice({
    name: "taskType",
    initialState,
    reducers: {
      setList(state, { payload }) {
        state.list = payload
      },
      setDefaultList(state, { payload }) {
        state.defaultList = payload
      },
      setIsAddMemberMenuOpen(state, { payload }) {
        state.isAddMemberMenuOpen = payload
      },
      setIsCheckListMenuOpen(state, { payload }) {
        state.isCheckListMenuOpen = payload
      },
      reset() {
        return initialState
      },
    },
    extraReducers: {
      [getTaskTypeListAction.fulfilled]: (state, { payload }) => {
        state.list = payload ?? []
      },
      [createNewTaskTypeAction.fulfilled]: (state, { payload }) => {
        state.list.push(payload)
      },
      [deleteTaskTypeAction.fulfilled]: (state, { payload }) => {
        state.list = state.list.filter((el) => el.id !== payload)
      },
      [updateTaskTypeAction.fulfilled]: (state, { payload }) => {
        const selectedTaskTypeIndex = state.list.findIndex(
          (taskType) => taskType.id === payload.id
        )
        if (selectedTaskTypeIndex !== -1) {
          state.list[selectedTaskTypeIndex] = payload
        }
      },
      // DEFAULTS
      [getDefaultTaskTypeListAction.fulfilled]: (state, { payload }) => {
        state.defaultList = payload ?? []
      },
      [createDefaultTaskTypeAction.fulfilled]: (state, { payload }) => {
        state.defaultList.push(payload)
      },
      [deleteDefaultTaskTypeAction.fulfilled]: (state, { payload }) => {
        state.defaultList = state.defaultList.filter((el) => el.id !== payload)
      },
      [updateDefaultTaskTypeAction.fulfilled]: (state, { payload }) => {
        const selectedTaskTypeIndex = state.defaultList.findIndex(
          (taskType) => taskType.id === payload.id
        )
        if (selectedTaskTypeIndex !== -1) {
          state.defaultList[selectedTaskTypeIndex] = payload
        }
      },
    },
  })
