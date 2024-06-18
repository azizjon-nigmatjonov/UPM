import { createAsyncThunk } from "@reduxjs/toolkit"
import projectStageService from "../../services/projectStageService"

export const getProjectStagesListAction = createAsyncThunk(
  "projectStage/getProjectStagesList",
  async (projectId) => {
    try {
      const res = await projectStageService.getList({ project_id: projectId })

      return res.stages
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const createProjectStageAction = createAsyncThunk(
  "projectStage/createProjectStage",
  async (data) => {
    try {
      const res = await projectStageService.create(data)

      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateProjectStageAction = createAsyncThunk(
  "projectStage/updateProjectStage",
  async (data) => {
    try {
      const res = await projectStageService.update(data)

      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const deleteProjectStageAction = createAsyncThunk(
  "projectStage/deleteProjectStage",
  async (id) => {
    try {
      await projectStageService.delete(id)

      return id
    } catch (error) {
      throw new Error(error)
    }
  }
)

// DEFAULTS

export const getDefaultStagesListAction = createAsyncThunk(
  "defaultStage/getDefaultStagesList",
  async () => {
    try {
      const res = await projectStageService.getDefaultList()

      return res.items
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const createDefaultStageAction = createAsyncThunk(
  "defaultStage/createDefaultStage",
  async (data) => {
    try {
      const res = await projectStageService.createDefault(data)

      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const updateDefaultStageAction = createAsyncThunk(
  "defaultStage/updateDefaultStage",
  async (data) => {
    try {
      const res = await projectStageService.updateDefault(data)

      return res
    } catch (error) {
      throw new Error(error)
    }
  }
)

export const deleteDefaultStageAction = createAsyncThunk(
  "defaultStage/deleteDefaultStage",
  async (id) => {
    try {
      await projectStageService.deleteDefault(id)

      return id
    } catch (error) {
      throw new Error(error)
    }
  }
)
