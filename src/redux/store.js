import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { alertReducer } from "./slices/alert.slice";
import { authReducer } from "./slices/auth.slice";
import { projectReducer } from "./slices/project.slice";
import { phaseReducer } from "./slices/phase.slice";
import { versionReducer } from "./slices/version.slice";
import { globalSettingsReducer } from "./slices/globalSettings.slice";
import { sprintReducer } from "./slices/sprint.slice";
import { epicReducer } from "./slices/epic.slice";
import { taskReducer } from "./slices/task.slice";
import { stageReducer } from "./slices/stage.slice";
import { subtaskReducer } from "./slices/subtask.slice";
import { ganttReducer } from "./slices/gantt.slice";
import { taskTypeReducer } from "./slices/taskType.slice";
import { statusTypeReducer } from "./slices/statusType.slice";
import { statusReducer } from "./slices/status.slice";
import { projectStageReducer } from "./slices/projectStage.slice";
import { projectTypeReducer } from "./slices/projectType.slice";
import { workloadReducer } from "./slices/workload.slice";
import { testPlanReducer } from "./slices/testPlan.slice";

const authPersistConfig = {
  key: "auth",
  storage,
};

const phasePersistConfig = {
  key: "phase",
  storage,
};
const projectTypesPersistConfig = {
  key: "project_types",
  storage,
};
const globalSettingsPersistConfig = {
  key: "globalSettings",
  storage,
};

const workloadPersistConfig = {
  key: "workloadSettings",
  storage,
};

const tesPlanPersistConfig = {
  key: "testPlan",
  storage
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  phase: persistReducer(phasePersistConfig, phaseReducer),
  project_types: persistReducer(projectTypesPersistConfig, projectTypeReducer),
  testPlan: persistReducer(tesPlanPersistConfig, testPlanReducer),
  globalSettings: persistReducer(
    globalSettingsPersistConfig,
    globalSettingsReducer
  ),
  workload: persistReducer(
    workloadPersistConfig,
    workloadReducer
  ),
  alert: alertReducer,
  project: projectReducer,
  version: versionReducer,
  sprint: sprintReducer,
  epic: epicReducer,
  task: taskReducer,
  stage: stageReducer,
  subtask: subtaskReducer,
  gantt: ganttReducer,
  taskType: taskTypeReducer,
  statusType: statusTypeReducer,
  status: statusReducer,
  projectStage: projectStageReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
