// import { createNewSubtaskAction, deleteSubtaskAction, updateGanttPositionsAction, updateSubtaskAction, updateSubtaskOrderAction } from "../thunks/subtask.thunk"
import { createSlice } from "@reduxjs/toolkit"
import { union } from "lodash-es"

const initialState = {
  list: [],
  selectedSubtasks: []
}

export const { actions: subtaskActions, reducer: subtaskReducer } = createSlice({
  name: "subtask",
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
    edit(state, { payload }) {
      const selectedSubtaskIndex = state.list.findIndex(subtask => subtask.id === payload.id)
      if (selectedSubtaskIndex !== -1) {
        state.list[selectedSubtaskIndex] = payload
      }
    },
    addSubtask (state, { payload }) {
      state.list.push(payload)
    },
    addSelectedSubtasks(state, { payload }) {
      state.selectedSubtasks = union(state.selectedSubtasks, payload)
      // state.selectedSubtasks = [...state.selectedSubtasks, ...payload]
    },
    removeSelectedSubtasks(state, { payload }) {
      state.selectedSubtasks = state.selectedSubtasks.filter(el => !payload.includes(el))
    },
    cleanSelectedSubtasks(state) {
      state.selectedSubtasks = []
    },
    reset() {
      return initialState
    },
  },
  extraReducers: {
    'subtask/createNewSubtask/fulfilled': (state, { payload }) => {
      state.list.push(payload)
    },
    'subtask/deleteSubtask/fulfilled': (state, { payload }) => {
      state.list = state.list.filter(el => el.id !== payload)
    },
    'subtask/updateSubtask/fulfilled': (state, { payload }) => {
      const selectedSubtaskIndex = state.list.findIndex(subtask => subtask.id === payload.id)
      if (selectedSubtaskIndex !== -1) {
        state.list[selectedSubtaskIndex] = payload
      }
    },
    'subtask/updateGanttPositions/fulfilled': (state, { payload }) => {
      state.list = payload
    },
    
  },
})
