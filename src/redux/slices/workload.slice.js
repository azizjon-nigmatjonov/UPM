import { createSlice } from "@reduxjs/toolkit";
import { ROLES } from "../../constans/workloadConsts";

const initialState = {
  workloadProjects: [],
  workloadPlans: [],
  workloadFilters: ROLES.map((role, idx) => ({
    ...role,
    checked: true,
  })),
};

export const { actions: workloadActions, reducer: workloadReducer } =
  createSlice({
    name: "workload",
    initialState,
    reducers: {
      setWorkloadProjects(state, { payload }) {
        state.workloadProjects = payload;
      },
      setWorkloadPlans(state, { payload }) {
        state.workloadPlans = payload;
      },
      setWorkloadFilters(state, { payload }) {
        state.workloadFilters = [...payload];
      },
    },
  });
