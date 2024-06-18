import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  project_types: []
}

export const {
  actions: projectTypeAction,
  reducer: projectTypeReducer 
} = createSlice({
  name: "project_types",
  initialState,
  reducers: {
    setProjectTypes(state, { payload }) {
      state.project_types = payload
    },
    addPhase(state, { payload }) {
      state.project_types.push(payload)
    },
    removePhase(state, { payload }) {
      state.project_types = state.project_types.filter(el => el.id !== payload)
    },
    updatePhase(state, { payload }) {
      state.project_types[state.project_types.findIndex(el => el.id === payload.id)] = payload
    }
  }
})
