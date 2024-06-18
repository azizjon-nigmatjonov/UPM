import fileSystemConfig from "../../configs/fileSystem.config"
import fileService from "../../services/fileService"
import phaseService from "../../services/phaseService"
import projectService from "../../services/projectService"
import sprintService from "../../services/sprintService"
import sprintStepsService from "../../services/sprintStepsService"
import versionsService from "../../services/versionsService"
import {
  sortByOrderNumber,
  sortByOrderNumberReverse,
} from "../../utils/sortByOrderNumber"
import { epicActions } from "../slices/epic.slice"
import { globalSettingsActions } from "../slices/globalSettings.slice"
import { phaseActions } from "../slices/phase.slice"
import { projectActions } from "../slices/project.slice"
import { projectTypeAction } from "../slices/projectType.slice"
import { sprintActions } from "../slices/sprint.slice"
import { stageActions } from "../slices/stage.slice"
import { statusActions } from "../slices/status.slice"
import { statusTypeActions } from "../slices/statusType.slice"
import { subtaskActions } from "../slices/subtask.slice"
import { taskTypeActions } from "../slices/taskType.slice"
import { versionActions } from "../slices/version.slice"
import { getProjectStagesListAction } from "./projectStage.thunk"
import { getStatusListAction } from "./status.thunk"
import { getTaskTypeListAction } from "./taskType.thunk"

export const fetchAllProjectDetails = (projectId) => (dispatch) => {
  dispatch(globalSettingsActions.setSidebarNavigationVisible(false))
  dispatch(fetchProjectInfo(projectId))
  dispatch(getTaskTypeListAction())
  dispatch(fetchSprintStepsList(projectId))
  dispatch(getStatusListAction())
  dispatch(fetchSprintsList(projectId))
  dispatch(fetchVersionsList({ project_id: projectId }))
  dispatch(getProjectStagesListAction())
}

export const resetAllProjectDetails = () => (dispatch) => {
  dispatch(projectActions.reset())
  dispatch(versionActions.reset())
  dispatch(sprintActions.reset())
  dispatch(subtaskActions.reset())
  dispatch(statusActions.reset())
  dispatch(taskTypeActions.reset())
  dispatch(epicActions.reset())
  dispatch(taskTypeActions.reset())
  dispatch(stageActions.reset())
  dispatch(statusTypeActions.reset())
}

export const fetchSprintStepsList = (projectId) => (dispatch) => {
  sprintStepsService.getList({ project_id: projectId }).then((res) => {
    dispatch(projectActions.setSprintStepsList(res.projectSprintSteps))
  })
}

export const fetchPhasesList = () => (dispatch) => {
  phaseService.getList().then((res) => {
    dispatch(phaseActions.setPhases(res.phases?.sort(sortByOrderNumber) ?? []))
  })
}
export const fetchProjectTypeList = () => (dispatch) => {
  projectService.getProjectTypes().then((res)=> {
    dispatch(projectTypeAction.setProjectTypes(res?.items ?? []))
  })
}

export const fetchProjectInfo = (id) => async (dispatch) => {
  try {
    const projectInfo = await projectService.getById(id)
    if (projectInfo.folder_id && projectInfo.attached_files_folder_id)
      return dispatch(projectActions.setInfo(projectInfo))

    if (!projectInfo.folder_id) {
      const createdFolder = await fileService.createFolder({
        icon: "",
        name: projectInfo.title,
        parent_id: fileSystemConfig.rootFolderID,
      })

      projectInfo.folder_id = createdFolder.id
    }

    if (!projectInfo.attached_files_folder_id) {
      const createdFolder = await fileService.createFolder({
        icon: "",
        name: "Subtask files",
        parent_id: projectInfo.folder_id,
      })

      projectInfo.attached_files_folder_id = createdFolder.id
    }

    await projectService.update(projectInfo)

    dispatch(projectActions.setInfo(projectInfo))
  } catch (error) {
    console.log(error)
  }
}

export const fetchVersionsList = (params) => (dispatch) => {
  dispatch(versionActions.setLoader(true))

  versionsService
    .getList(params)
    .then((res) => {
      const computedList = res.versions?.sort(sortByOrderNumber)
      if (computedList?.[0])
        dispatch(
          versionActions.setSelectedVersionId(computedList[0].id ?? null)
        )
      dispatch(versionActions.setList(computedList))
    })
    .finally(() => dispatch(versionActions.setLoader(false)))
}

export const fetchSprintsList = (projectId) => (dispatch) => {
  dispatch(sprintActions.setLoader(true))

  sprintService
    .getList({ project_id: projectId })
    .then((res) => {
      const computedList = res.sprints?.sort(sortByOrderNumberReverse)
      if (computedList?.[0])
        dispatch(sprintActions.setSelectedSprintId(computedList[0].id ?? null))
      dispatch(sprintActions.setList(computedList))
    })
    .finally(() => dispatch(sprintActions.setLoader(false)))
}
