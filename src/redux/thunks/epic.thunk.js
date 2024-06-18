import { createAsyncThunk } from "@reduxjs/toolkit"
import epicsService from "../../services/epicsService"
import {
  calculateBeginDate,
  calculateFinishDate,
  calculateIndexedDates,
  calculateIndexedDatesInMonth,
  calculateIndexedDatesInYear,
} from "../../utils/calculateGanttCalendar"
import { sortByOrderNumber } from "../../utils/sortByOrderNumber"
import { epicActions } from "../slices/epic.slice"
import { ganttActions } from "../slices/gantt.slice"

export const getEpicListAction = createAsyncThunk(
  "epic/getEpicList",
  async (_, { getState, dispatch }) => {
    try {
      const versionId = getState().version.selectedVersionId
      
      const res = await epicsService.getList(versionId)
      
      const datesList = []
      res.epic_items.forEach((epic) => {
        if (epic.start_date?.expected) {
          datesList.push(new Date(epic.start_date?.expected))
        }
        if (epic.start_date?.fact) {
          datesList.push(new Date(epic.start_date?.fact))
        }
      })

      const startDate = calculateBeginDate(datesList)
      
      const indexedDates = calculateIndexedDates(startDate)
      const indexedDatesForMonth = calculateIndexedDatesInMonth(startDate)
      const indexedDatesForYear = calculateIndexedDatesInYear(startDate)

      dispatch(
        ganttActions.setStartDateAndIndexedDates({
          startDate: startDate.toString(),
          indexedDates,
          indexedDatesForMonth,
          indexedDatesForYear
        })
      )

      return res.epic_items?.sort(sortByOrderNumber) ?? []
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
)

export const createNewEpicAction = createAsyncThunk(
  "epic/createNewEpic",
  async ({ title, start_date, end_date, color }, { getState }) => {
    try {
      const state = getState()
      const data = {
        creator_id: state.auth.userInfo.id,
        title,
        version_id: state.version.selectedVersionId,
        status_id: state.project.info.default_status,
        start_date,
        end_date,
        color
      }

      const res = await epicsService.create(data)
      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateEpicOrderAction = createAsyncThunk(
  "epic/updateEpicOrder",
  async (
    { list, removedIndex, addedIndex },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState()
    const listPrevValue = state.epic.list
    const selectedVersionId = state.version.selectedVersionId
    dispatch(epicActions.setList(list))

    try {
      await epicsService.updateOrder(
        listPrevValue[removedIndex].id,
        addedIndex + 1,
        selectedVersionId
      )
      return list
    } catch (error) {
      rejectWithValue(listPrevValue)
    }
  }
)

export const deleteEpicAction = createAsyncThunk(
  "epic/deleteEpic",
  async (id, { getState }) => {
    try {
      const selectedVersionId = getState().version.selectedVersionId

      await epicsService.delete(id, selectedVersionId)

      return id
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateEpicAction = createAsyncThunk(
  "epic/updateEpic",
  async (newData, { getState }) => {
    try {
      const selectedVersionId = getState().version.selectedVersionId

      const data = {
        ...newData,
        version_id: selectedVersionId,
      }

      await epicsService.update(data)

      return newData
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const calculateEpicTimesAction = createAsyncThunk(
  "epic/calculateEpicTimes",
  (epicId, { getState }) => {
    const state = getState()

    const taskList = state.task.list?.filter((task) => task.epic_id === epicId)

    const startDatesList = []
    const endDatesList = []
    taskList.forEach((task) => {
      if (task.start_date?.expected) {
        startDatesList.push(new Date(task.start_date?.expected))
      }
      if (task.end_date?.expected) {
        endDatesList.push(new Date(task.end_date?.expected))
      }
    })

    const start_time = calculateBeginDate(startDatesList)
    const end_time = calculateFinishDate(endDatesList)

    return {
      id: epicId,
      start_time,
      end_time
    }

  }
)
