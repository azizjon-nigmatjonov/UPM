

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  list: [],
  loader: false,
  selectedVersionId: null
}

export const { actions: versionActions, reducer: versionReducer } = createSlice(
  {
    name: "version",
    initialState,
    reducers: {
      setList(state, { payload }) {
        state.list = payload ?? []
      },
      setLoader(state, { payload }) {
        state.loader = payload
      },
      add(state, { payload }) {
        state.list.push(payload)
      },
      remove(state, { payload }) {
        state.list = state.list.filter(el => el.id !== payload)
      },
      edit(state, { payload: { index, data } }) {
        state.list[index] = {
          ...state.list[index],
          ...data
        }
      },
      setSelectedVersionId(state, { payload }) {
        state.selectedVersionId = payload
      },
      reset() {
        return initialState
      }
    }
  }
)
