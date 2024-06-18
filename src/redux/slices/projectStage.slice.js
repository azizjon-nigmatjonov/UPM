import { createSlice } from "@reduxjs/toolkit"
import {
  createProjectStageAction,
  deleteProjectStageAction,
  getProjectStagesListAction,
  updateProjectStageAction,
  // createDefaultStageAction,
  // deleteDefaultStageAction,
  // updateDefaultStageAction,
  // getDefaultStagesListAction,
} from "../thunks/projectStage.thunk"

const initialState = {
  list: [],
  loader: false,
  // defaultList: [],
  // defaultLoader: false,
}

export const { actions: projectStageActions, reducer: projectStageReducer } =
  createSlice({
    name: "projectStage",
    initialState,
    reducers: {
      reset() {
        return initialState
      },
    },
    extraReducers: {
      [getProjectStagesListAction.fulfilled]: (state, { payload }) => {
        state.list = payload ?? []
        state.loader = false
      },
      [getProjectStagesListAction.pending]: (state) => {
        state.list = []
        state.loader = true
      },
      [getProjectStagesListAction.rejected]: (state) => {
        state.loader = false
      },
      [createProjectStageAction.fulfilled]: (state, { payload }) => {
        state.list.push(payload)
      },
      [updateProjectStageAction.fulfilled]: (state, { payload }) => {
        const selectedIndex = state.list.findIndex((el) => el.id === payload.id)
        if (selectedIndex !== -1) {
          state.list[selectedIndex] = payload
        }
      },
      [deleteProjectStageAction.fulfilled]: (state, { payload }) => {
        state.list = state.list.filter((el) => el.id !== payload)
      },
      // // DEFAULTS
      // [getDefaultStagesListAction.fulfilled]: (state, { payload }) => {
      //   state.defaultList = payload ?? []
      //   state.defaultLoader = false
      // },
      // [getDefaultStagesListAction.pending]: (state) => {
      //   state.defaultList = []
      //   state.defaultLoader = true
      // },
      // [getDefaultStagesListAction.rejected]: (state) => {
      //   state.defaultLoader = false
      // },
      // [createDefaultStageAction.fulfilled]: (state, { payload }) => {
      //   state.defaultList.push(payload)
      // },
      // [updateDefaultStageAction.fulfilled]: (state, { payload }) => {
      //   const selectedIndex = state.defaultList.findIndex(
      //     (el) => el.id === payload.id
      //   )
      //   if (selectedIndex !== -1) {
      //     state.defaultList[selectedIndex] = payload
      //   }
      // },
      // [deleteDefaultStageAction.fulfilled]: (state, { payload }) => {
      //   state.defaultList = state.defaultList.filter((el) => el.id !== payload)
      // },
    },
  })
