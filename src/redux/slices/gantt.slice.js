import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  startDate: null,
  indexedDates: [],
  indexedDatesForMonth: [],
  indexedDatesForYear: [],
  ganttPeriod: "week",
  ganttPercent: "all",
};

export const { actions: ganttActions, reducer: ganttReducer } = createSlice({
  name: "gantt",
  initialState,
  reducers: {
    setStartDateAndIndexedDates(state, { payload }) {
      state.startDate = payload.startDate;
      state.indexedDates = payload.indexedDates;
      state.indexedDatesForMonth = payload.indexedDatesForMonth;
      state.indexedDatesForYear = payload.indexedDatesForYear;
    },
    setGanttPeriod(state, { payload }) {
      state.ganttPeriod = payload;
    },
    setGanttPercent(state, { payload }) {
      state.ganttPercent = payload;
    },
    reset() {
      return initialState;
    },
  },
});
