import { createSlice } from "@reduxjs/toolkit"


export const {
  actions: globalSettingsActions,
  reducer: globalSettingsReducer
} = createSlice({
  name: "globalSettings",
  initialState: {
    sidebarNavigationVisible: true
  },
  reducers: {
    setSidebarNavigationVisible(state, { payload }) {
      state.sidebarNavigationVisible = payload
    }
  }
})