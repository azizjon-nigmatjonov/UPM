import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  phases: []
}

export const {
  actions: phaseActions,
  reducer: phaseReducer 
} = createSlice({
  name: "phase",
  initialState,
  reducers: {
    setPhases(state, { payload }) {
      state.phases = payload
    },
    addPhase(state, { payload }) {
      state.phases.push(payload)
    },
    removePhase(state, { payload }) {
      state.phases = state.phases.filter(el => el.id !== payload)
    },
    updatePhase(state, { payload }) {
      state.phases[state.phases.findIndex(el => el.id === payload.id)] = payload
    }
  }
})
