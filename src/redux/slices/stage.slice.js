import { createSlice } from "@reduxjs/toolkit"
import {
  createNewStageAction,
  deleteStageAction,
  updateStageAction,
  updateStageOrderAction,
} from "../thunks/stage.thunk"

const initialState = {
  list: [],
  openedStages: []
}

export const { actions: stageActions, reducer: stageReducer } = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setList(state, { payload }) {
      state.list = [
        ...state.list.filter(
          (el) => payload.findIndex((el2) => el2.id === el.id) === -1
        ),
        ...payload,
      ]
    },
    addOpenedStages(state, { payload }) {
      state.openedStages.push(payload)
    },
    removeOpenedStages(state, { payload }) {
      state.openedStages = state.openedStages.filter(el => el !== payload)
    },
    reset() {
      return initialState
    },
  },
  extraReducers: {
    [createNewStageAction.fulfilled]: (state, { payload }) => {
      state.list.push(payload)
    },
    [deleteStageAction.fulfilled]: (state, { payload }) => {
      state.list = state.list.filter(el => el.id !== payload)
    },
    [updateStageAction.fulfilled]: (state, { payload }) => {
      const selectedStageIndex = state.list.findIndex(stage => stage.id === payload.id)
      if (selectedStageIndex !== -1) {
        state.list[selectedStageIndex] = payload
      }
    },
    [updateStageOrderAction.rejected]: (state, { payload }) => {
      state.list = payload
    },
  },
})
