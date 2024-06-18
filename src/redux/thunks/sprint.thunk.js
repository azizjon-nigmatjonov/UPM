import { createAsyncThunk } from "@reduxjs/toolkit"
import sprintService from "../../services/sprintService"
import { sortByOrderNumber } from "../../utils/sortByOrderNumber"
import { subtaskActions } from "../slices/subtask.slice"
import { showAlert } from "./alert.thunk"

export const getStepsInsideSprintAction = createAsyncThunk(
  "sprint/getStepsInsideSprint",
  async (id, { dispatch }) => {
    try {
      const res = await sprintService.getById(id)

      return (
        res.steps?.map((step) => ({
          ...step,
          sprint_id: id,
          sprint_subtask_items:
            step.sprint_subtask_items?.sort(sortByOrderNumber) ?? [],
        })) ?? []
      )
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const deleteSubtaskFromSprintAction = createAsyncThunk(
  "sprint/deleteSubtaskFromSprint",
  async ({sprintId, stepId, subtaskId}, { dispatch }) => {
    try {

      sprintService.removeSubtaskFromSprint(sprintId, stepId, subtaskId)

      return {subtaskId, stepId}
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const addMultipleTasksToSprintAction = createAsyncThunk(
  "sprint/addMultipleTasksToSprint",
  async (_, { getState, dispatch }) => {
    const state = getState()

    const subtask_ids = state.subtask.selectedSubtasks
    const sprint_id = state.sprint.list?.[0]?.id

    try {

      const res = await sprintService.addMultipleSubtaskToSprint({
        subtask_ids,
        sprint_id
      })

      dispatch(showAlert(`Subtasks added to Sprint week #${state.sprint.list?.[0]?.order_number}`, 'success'))
      dispatch(subtaskActions.cleanSelectedSubtasks())
      return (
        res.steps?.map((step) => ({
          ...step,
          sprint_id,
          sprint_subtask_items:
            step.sprint_subtask_items?.sort(sortByOrderNumber) ?? [],
        })) ?? []
      ) ?? []
    } catch (error) {
      throw new Error('error')
    }
  }
)
