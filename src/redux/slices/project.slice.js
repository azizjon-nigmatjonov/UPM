import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  taskTypeList: [],
  sprintStepsList: [],
  statusLoader: false,
  info: null,
}

export const { actions: projectActions, reducer: projectReducer } = createSlice(
  {
    name: "project",
    initialState,
    reducers: {
      addStatus(state, { payload }) {
        state.statusList.push(payload)
      },
      deleteStatus(state, {payload}) {
        state.statusList = state.statusList.filter(status => status.id !== payload)
      },
      editStatus(state, {payload}) {
        state.statusList = state.statusList.map(el => {
          if(el.id !== payload.id) return el
          return {
            ...el,
            title: payload.title
          }
        })
      },
      setStatusLoader(state, { payload }) {
        state.statusLoader = payload
      },
      setInfo(state, { payload }) {
        state.info = payload
      },
      setTaskTypeList(state, { payload }) {
        state.taskTypeList = payload
      },
      addTaskType(state, { payload }) {
        state.taskTypeList.push(payload)
      },
      setSprintStepsList(state, { payload }) {
        state.sprintStepsList = payload
      },
      reset() {
        return initialState
      }
    },
  }
)
