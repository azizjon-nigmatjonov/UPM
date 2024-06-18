import { createSlice } from "@reduxjs/toolkit"
import {
  calculateEpicTimesAction,
  createNewEpicAction,
  deleteEpicAction,
  getEpicListAction,
  updateEpicAction,
  updateEpicOrderAction,
} from "../thunks/epic.thunk"

const initialState = {
  list: [],
  defaultList: [],
  loader: false,
  openedEpics: [],
}

export const { actions: epicActions, reducer: epicReducer } = createSlice({
  name: "epic",
  initialState,
  reducers: {
    setList(state, { payload }) {
      state.list = payload ?? []
    },
    setDefaultList(state, { payload }) {
      state.defaultList = payload ?? []
    },
    addOpenedEpic(state, { payload }) {
      state.openedEpics.push(payload)
    },
    removeOpenedEpic(state, { payload }) {
      state.openedEpics = state.openedEpics.filter((el) => el !== payload)
    },
    reset() {
      return initialState
    },
  },
  extraReducers: {
    [getEpicListAction.pending]: (state) => {
      state.loader = true
      state.list = []
    },
    [getEpicListAction.fulfilled]: (state, { payload }) => {
      state.list = payload ?? []
      state.loader = false
    },
    [getEpicListAction.rejected]: (state) => {
      state.loader = false
    },
    [createNewEpicAction.fulfilled]: (state, { payload }) => {
      state.list.push(payload)
    },
    [deleteEpicAction.fulfilled]: (state, { payload }) => {
      state.list = state.list.filter((el) => el.id !== payload)
    },
    [updateEpicAction.fulfilled]: (state, { payload }) => {
      const selectedEpicIndex = state.list.findIndex(
        (epic) => epic.id === payload.id
      )
      if (selectedEpicIndex !== -1) {
        state.list[selectedEpicIndex] = payload
      }
    },
    [calculateEpicTimesAction.fulfilled]: (state, { payload }) => {
      const selectedEpicIndex = state.list.findIndex(
        (epic) => epic.id === payload.id
      )
      if (selectedEpicIndex !== -1) {
        state.list[selectedEpicIndex] = {
          ...state.list[selectedEpicIndex],
          ...payload,
        }
      }
    },
    [updateEpicOrderAction.rejected]: (state, { payload }) => {
      state.list = payload
    },
  },
})
