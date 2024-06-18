import { subtaskActions } from "../slices/subtask.slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { format } from "date-fns";
import subtaskService from "../../services/subtaskService";

export const createNewSubtaskAction = createAsyncThunk(
  "subtask/createNewSubtask",
  async (data, { getState }) => {
    try {
      const state = getState();

      const computedData = {
        status_id: state.project.info.default_status,
        ...data,
        creator_id: state.auth.userInfo.id,
        version_id: state.version.selectedVersionId,
      };

      const res = await subtaskService.create(computedData);

      return res;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const updateSubtaskOrderAction = createAsyncThunk(
  "subtask/updateSubtaskOrder",
  async ({ list, id, addedIndex }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const listPrevValue = state.task.list;
    dispatch(subtaskActions.setList(list));

    try {
      await subtaskService.updateOrder(id, addedIndex + 1);
      return list;
    } catch (error) {
      rejectWithValue(listPrevValue);
    }
  }
);

export const deleteSubtaskAction = createAsyncThunk(
  "subtask/deleteSubtask",
  async (id) => {
    try {
      await subtaskService.delete(id);

      return id;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const updateSubtaskAction = createAsyncThunk(
  "subtask/updateSubtask",
  async (newData, { getState }) => {
    try {
      await subtaskService.update(newData);

      return newData;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const updateGanttPositionsAction = createAsyncThunk(
  "subtask/updateGanttPositions",
  (_, { getState }) => {
    const state = getState();

    const subtaskList = state.subtask.list;
    const ganttPeriod = state.gantt.ganttPeriod;
    const indexedDates =
      ganttPeriod === "week"
        ? state.gantt.indexedDates
        : ganttPeriod === "month"
        ? state.gantt.indexedDatesForMonth
        : state.gantt.indexedDatesForYear;
    // const indexedDates = state.gantt.indexedDates

    const computedSubtaskList = subtaskList.map((subtask) => {
      const expectedStartDate = format(
        new Date(subtask.start_date?.expected),
        ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
      );
      const expectedEndDate = format(
        new Date(subtask.end_time),
        ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
      );

      const factStartDate = subtask.start_date?.fact
        ? format(
            new Date(subtask.start_date?.fact),
            ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
          )
        : new Date();
      const factEndDate = subtask.end_date?.fact
        ? format(
            new Date(subtask.end_date?.fact),
            ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
          )
        : new Date();

      return {
        ...subtask,
        expectedStartIndex: indexedDates.findIndex(
          (el) => el === expectedStartDate
        ),
        expectedEndIndex: indexedDates.findIndex(
          (el) => el === expectedEndDate
        ),
        factStartIndex: indexedDates.findIndex((el) => el === factStartDate),
        factEndIndex: indexedDates.findIndex((el) => el === factEndDate),
      };
    });

    return computedSubtaskList;
  }
);

export const editGanttSubtaskPosisitonAction = createAsyncThunk(
  "subtask/editGanttSubtaskPosisiton",
  async ({ beginIndex, endIndex, subtask }, { getState, dispatch }) => {
    const indexedDates = getState().gantt.indexedDates;

    const beginDate = indexedDates[beginIndex] ?? indexedDates[0];
    const endDate = indexedDates[endIndex];

    const computedData = {
      ...subtask,
      start_time: beginDate,
      end_time: endDate,
      expectedStartIndex: beginIndex,
      expectedEndIndex: endIndex,
    };

    dispatch(subtaskActions.edit(computedData));

    try {
      await subtaskService.updateTime(subtask.id, {
        start_time: computedData.start_time,
        end_time: computedData.end_time,
      });
    } catch (error) {
      console.log("ERROR ==>", error);
      throw new Error(error);
    }
  }
);
