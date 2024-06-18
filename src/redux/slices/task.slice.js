import { createSlice } from "@reduxjs/toolkit"
import { updateEpicOrderAction } from "../thunks/epic.thunk"
import {
  createNewTaskAction,
  deleteTaskAction,
  getTaskListInsideEpicAction,
  updateTaskAction,
} from "../thunks/task.thunk"

const initialState = {
  list: [],
  openedTasks: [],
}

export const { actions: taskActions, reducer: taskReducer } = createSlice({
  name: "task",
  initialState,
  reducers: {
    setList(state, { payload }) {
      state.list = payload ?? []
    },
    addOpenedTask(state, { payload }) {
      state.openedTasks.push(payload)
    },
    edit(state, { payload }) {
      const selectedTaskIndex = state.list.findIndex(
        (task) => task.id === payload.id
      )
      if (selectedTaskIndex !== -1) {
        state.list[selectedTaskIndex] = payload
      }
    },
    removeOpenedTask(state, { payload }) {
      state.openedTasks = state.openedTasks.filter((el) => el !== payload)
    },
    reset() {
      return initialState
    },
  },
  extraReducers: {
    [getTaskListInsideEpicAction.fulfilled]: (state, { payload }) => {
      state.list = [
        ...state.list.filter(
          (el) => payload.findIndex((el2) => el2.id === el.id) === -1
        ),
        ...payload,
      ]
    },
    [createNewTaskAction.fulfilled]: (state, { payload }) => {
      if (payload) state.list.push(payload)
    },
    [deleteTaskAction.fulfilled]: (state, { payload }) => {
      state.list = state.list.filter((el) => el.id !== payload)
    },
    [updateTaskAction.fulfilled]: (state, { payload }) => {
      const selectedTaskIndex = state.list.findIndex(
        (task) => task.id === payload.id
      )
      if (selectedTaskIndex !== -1) {
        state.list[selectedTaskIndex] = payload
      }
    },
    [updateEpicOrderAction.rejected]: (state, { payload }) => {
      state.list = payload
    },
  },
})
