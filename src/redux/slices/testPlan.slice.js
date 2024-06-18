import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  checkedFolders: [],
  selectedFolder: {},
  selectedCaseId: '',

}

export const {
  actions: testPlanActions,
  reducer: testPlanReducer 
} = createSlice({
  name: "testPlan",
  initialState,
  reducers: {
    setCheckedFolders: (state, {payload}) => {
        state.checkedFolders = payload
    },
    setSelectedFolder: (state, {payload}) => {
      state.selectedFolder = payload
    },
    setSelectedCaseId: (state, {payload}) => {
      state.selectedCaseId = payload
    }
  }
})
