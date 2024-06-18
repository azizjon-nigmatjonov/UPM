import { createSlice } from "@reduxjs/toolkit"
import {
  createNewStatusTypeAction,
  deleteStatusTypeAction,
  getStatusTypeListAction,
  updateStatusTypeAction,
  // getDefaultStatusTypeListAction,
  // createNewDefaultStatusTypeAction,
  // deleteDefaultStatusTypeAction,
  // updateDefaultStatusTypeAction,
} from "../thunks/statusType.thunk"

const initialState = {
  list: [],
  defaultList: [],
}

export const { actions: statusTypeActions, reducer: statusTypeReducer } =
  createSlice({
    name: "statusType",
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
      setDefaultList(state, { payload }) {
        state.defaultList = [
          ...state.defaultList.filter(
            (el) => payload.findIndex((el2) => el2.id === el.id) === -1
          ),
          ...payload,
        ]
      },
      reset() {
        return initialState
      },
    },
    extraReducers: {
      [getStatusTypeListAction.fulfilled]: (state, { payload = [] }) => {
        state.list = [
          ...state.list.filter(
            (el) => payload.findIndex((el2) => el2.id === el.id) === -1
          ),
          ...payload,
        ]
      },
      [createNewStatusTypeAction.fulfilled]: (state, { payload }) => {
        state.list.push(payload)
      },
      [deleteStatusTypeAction.fulfilled]: (state, { payload }) => {
        state.list = state.list.filter((el) => el.id !== payload)
      },
      [updateStatusTypeAction.fulfilled]: (state, { payload }) => {
        const index = state.list.findIndex((el) => el.id === payload.id)
        if (index !== -1) {
          state.list[index] = payload
        }
      },
      // DEFAULTS
      // [getDefaultStatusTypeListAction.fulfilled]: (state, { payload = [] }) => {
      //   state.defaultList = [
      //     ...state.defaultList.filter(
      //       (el) => payload.findIndex((el2) => el2.id === el.id) === -1
      //     ),
      //     ...payload,
      //   ]
      // },
      // [createNewDefaultStatusTypeAction.fulfilled]: (state, { payload }) => {
      //   state.defaultList.push(payload)
      // },
      // [deleteDefaultStatusTypeAction.fulfilled]: (state, { payload }) => {
      //   state.defaultList = state.defaultList.filter((el) => el.id !== payload)
      // },
      // [updateDefaultStatusTypeAction.fulfilled]: (state, { payload }) => {
      //   const index = state.defaultList.findIndex((el) => el.id === payload.id)
      //   if (index !== -1) {
      //     state.defaultList[index] = payload
      //   }
      // },
    },
  })
