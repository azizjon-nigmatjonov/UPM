



import { createSlice } from "@reduxjs/toolkit"
import { addMultipleTasksToSprintAction, deleteSubtaskFromSprintAction, getStepsInsideSprintAction } from "../thunks/sprint.thunk"

const initialState = {
  list: [],
  loader: false,
  selectedSprintId: null,
  stepsList: []
}

export const { actions: sprintActions, reducer: sprintReducer } = createSlice(
  {
    name: "sprint",
    initialState,
    reducers: {
      setList(state, { payload }) {
        state.list = payload ?? []
      },
      setLoader(state, { payload }) {
        state.loader = payload
      },
      add(state, { payload }) {
        state.list.unshift(payload)
        state.selectedSprintId = payload.id
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
      setSelectedSprintId(state, { payload }) {
        state.selectedSprintId = payload
      },
      addSubtaskToSprint (state, { payload }) {
        const selectedStep = state.stepsList.find(step => step.id === payload.stepId)
        selectedStep?.sprint_subtask_items?.push(payload.data)
      },
      reset() {
        return initialState
      }
    },
    extraReducers: {
      [getStepsInsideSprintAction.fulfilled]: (state, {payload}) => {
        state.stepsList.push(...payload)
      },
      [deleteSubtaskFromSprintAction.fulfilled]: (state, {payload}) => {
        const selectedStep = state.stepsList.find(step => step.id === payload.stepId)
        
        selectedStep.sprint_subtask_items = selectedStep?.sprint_subtask_items?.filter(el => el.id !== payload.subtaskId)
      },
      [addMultipleTasksToSprintAction.fulfilled]: (state, { payload }) => {
        state.stepsList = [
          ...state.stepsList.filter(
            (el) => payload.findIndex((el2) => el2.id === el.id) === -1
          ),
          ...payload,
        ]
      }
    }
  }
)
