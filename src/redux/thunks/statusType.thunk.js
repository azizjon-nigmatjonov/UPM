import { createAsyncThunk } from "@reduxjs/toolkit"
import statusTypeService from "../../services/statusTypeService"
import { sortByOrderNumber } from "../../utils/sortByOrderNumber"
import { statusTypeActions } from "../slices/statusType.slice"

export const getStatusTypeListAction = createAsyncThunk(
  "statusType/getStatusTypeList",
  async (taskTypeId) => {
    try {
      const res = await statusTypeService.getList({
        project_task_type_id: taskTypeId,
      })
      return res.status_groups?.sort(sortByOrderNumber)
    } catch (error) {
      throw new Error()
    }
  }
)

export const createNewStatusTypeAction = createAsyncThunk(
  "statusType/createNewStatusType",
  async (data) => {
    try {
      const res = await statusTypeService.create(data)

      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateStatusTypeOrderAction = createAsyncThunk(
  "statusType/updateStatusTypeOrder",
  async ({ list, id, addedIndex }, { getState, dispatch, rejectWithValue }) => {
    dispatch(statusTypeActions.setList(list))

    try {
      await statusTypeService.updateOrder(id, addedIndex + 1)
      return list
    } catch (error) {
      throw new Error()
    }
  }
)

export const deleteStatusTypeAction = createAsyncThunk(
  "statusType/deleteStatusType",
  async (id) => {
    try {
      await statusTypeService.delete(id)

      return id
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateStatusTypeAction = createAsyncThunk(
  "statusType/updateStatusType",
  async (newData) => {
    try {
      await statusTypeService.update(newData)

      return newData
    } catch (error) {
      throw new Error(error)
    }
  }
)

// DEFAULTS

// export const getDefaultStatusTypeListAction = createAsyncThunk(
//   "statusType/getDefaultStatusTypeList",
//   async (taskTypeId) => {
//     try {
//       const res = await statusTypeService.getDefaultList({
//         "task-type-id": taskTypeId,
//       })
//       return res.items?.sort(sortByOrderNumber)
//     } catch (error) {
//       throw new Error()
//     }
//   }
// )

// export const createNewDefaultStatusTypeAction = createAsyncThunk(
//   "statusType/createNewDefaultStatusType",
//   async (data) => {
//     try {
//       const res = await statusTypeService.createDefault(data)

//       return res
//     } catch (error) {
//       throw new Error(error)
//     }
//   }
// )

// export const updateDefaultStatusTypeOrderAction = createAsyncThunk(
//   "statusType/updateDefaultStatusTypeOrder",
//   async (
//     { defaultList, id, addedIndex },
//     { getState, dispatch, rejectWithValue }
//   ) => {
//     dispatch(statusTypeActions.setDefaultList(defaultList))

//     try {
//       await statusTypeService.updateDefaultOrder(id, addedIndex + 1)
//       return defaultList
//     } catch (error) {
//       throw new Error()
//     }
//   }
// )

// export const deleteDefaultStatusTypeAction = createAsyncThunk(
//   "statusType/deleteDefaultStatusType",
//   async (id) => {
//     try {
//       await statusTypeService.deleteDefault(id)

//       return id
//     } catch (error) {
//       throw new Error(error)
//     }
//   }
// )

// export const updateDefaultStatusTypeAction = createAsyncThunk(
//   "statusType/updateDefaultStatusType",
//   async (newData) => {
//     try {
//       await statusTypeService.updateDefault(newData)

//       return newData
//     } catch (error) {
//       throw new Error(error)
//     }
//   }
// )
