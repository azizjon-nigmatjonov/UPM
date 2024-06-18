import { lazy } from "react"

const BacklogPage = lazy(() => import("../views/ProjectDetail/Backlog"))
const BoardPage = lazy(() => import("../views/ProjectDetail/Board"))
const GanttPage = lazy(() => import("../views/ProjectDetail/Gantt"))
const ProjectsPage = lazy(() => import("../views/Projects"))
const ProjectForm = lazy(() => import("../views/Projects/Form"))
const ProjectDetail = lazy(() => import("../views/ProjectDetail"))
const PhasesPage = lazy(() => import("../views/Phases"))
const PhasesForm = lazy(() => import("../views/Phases/Form"))
const PositionsPage = lazy(() => import("../views/Positions"))
const PositionsForm = lazy(() => import("../views/Positions/Form"))
const StageStatusesPage = lazy(() => import("../views/StageStatuses"))
const SpheresPage = lazy(() => import("../views/Spheres"))
const SpheresForm = lazy(() => import("../views/Spheres/Form"))
const ProjectDashboard = lazy(() =>
  import("../views/ProjectDetail/ProjectDashboard")
)
const SprintDetailPage = lazy(() => import("../views/SprintDetail"))
const ProjectFiles = lazy(() => import("../views/ProjectDetail/Files"))
const AuthMatrix = lazy(() => import("../views/AuthMatrix"))
const Notes = lazy(() => import("../views/ProjectDetail/Notes"))
const ClientPlatform = lazy(() => import("../views/AuthMatrix/ClientPlatform"))
const ClientType = lazy(() => import("../views/AuthMatrix/ClientType"))
const UsersPage = lazy(() => import("../views/Users"))
const UsersForm = lazy(() => import("../views/Users/Form"))
const ProjectCreateForm = lazy(() => import("../views/Projects/CreateForm"))
const CrossedPage = lazy(() => import("../views/AuthMatrix/Crossed"))
const RolesForm = lazy(() => import("../views/AuthMatrix/Crossed/Roles/Form"))
const IntegrationsForm = lazy(() =>
  import("../views/AuthMatrix/Crossed/Integrations/Form")
)
const SessionsPage = lazy(() =>
  import("../views/AuthMatrix/Crossed/Integrations/Sessions")
)
const Workload = lazy(() => import("../views/Workload"))

export const mainRoutes = [
  {
    path: "projects",
    component: ProjectsPage,
    permission: "PROJECTS",
  },
  {
    path: "projects/phase/:phaseId/create",
    component: ProjectCreateForm,
    permission: "PROJECTS/CREATE",
  },
  {
    path: "projects/:projectId",
    component: ProjectDetail,
    permission: "PROJECTS/DETAIL",
    children: [
      {
        path: "dashboard",
        component: ProjectDashboard,
        permission: "PROJECTS/DETAIL/DASHBOARD",
      },
      {
        path: "info",
        component: ProjectForm,
        permission: "PROJECTS/DETAIL/INFO",
      },
      {
        path: "backlog",
        component: BacklogPage,
        permission: "PROJECTS/DETAIL/BACKLOG",
      },
      {
        path: "sprint/:sprintId",
        component: SprintDetailPage,
        permission: "PROJECTS/DETAIL/SPRINT",
      },
      {
        path: "board/:typeId",
        component: BoardPage,
        permission: "PROJECTS/DETAIL/BOARD",
      },
      {
        path: "gantt",
        component: GanttPage,
        permission: "PROJECTS/DETAIL/GANTT",
      },
      {
        path: "files/:folderId",
        component: ProjectFiles,
        permission: "PROJECTS/DETAIL/FILES",
      },
      {
        path: "note",
        component: Notes,
        permission: "PROJECTS/DETAIL/NOTES",
      },
      {
        path: "test-plan",
        component: Notes,
        permission: "PROJECTS/DETAIL/NOTES",
      },
    ],
  },
  {
    path: "settings",
    permission: "SETTINGS",
    children: [
      {
        path: "auth-matrix/:projectId",
        component: AuthMatrix,
        permission: "SETTINGS/AUTH_MATRIX",
      },
      {
        path: "auth-matrix/:projectId/platform/:platformId",
        component: ClientPlatform,
        permission: "SETTINGS/AUTH_MATRIX/CLIENT_PLATFORM",
      },
      {
        path: "auth-matrix/:projectId/client-type/:typeId",
        component: ClientType,
        permission: "SETTINGS/AUTH_MATRIX/CLIENT_TYPE",
      },
      {
        path: "auth-matrix/:projectId/:platformId/:typeId/crossed",
        component: CrossedPage,
        permission: "SETTINGS/AUTH_MATRIX/CROSSED",
      },
      {
        path: "auth-matrix/:projectId/:platformId/:typeId/crossed/user/create",
        component: UsersForm,
        permission: "SETTINGS/AUTH_MATRIX/CROSSED/USERS/CREATE",
      },
      {
        path: "auth-matrix/:projectId/:platformId/:typeId/crossed/user/:userId",
        component: UsersForm,
        permission: "SETTINGS/AUTH_MATRIX/CROSSED/USERS/EDIT",
      },
      {
        path: "auth-matrix/:projectId/:platformId/:typeId/crossed/role/create",
        component: RolesForm,
        permission: "SETTINGS/AUTH_MATRIX/CROSSED/ROLES/CREATE",
      },
      {
        path: "auth-matrix/:projectId/:platformId/:typeId/crossed/role/:roleId",
        component: RolesForm,
        permission: "SETTINGS/AUTH_MATRIX/CROSSED/ROLES/EDIT",
      },
      {
        path: "auth-matrix/:projectId/:platformId/:typeId/crossed/integration/create",
        component: IntegrationsForm,
        permission: "SETTINGS/AUTH_MATRIX/CROSSED/INTEGRATIONS/CREATE",
      },
      {
        path: "auth-matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId",
        component: IntegrationsForm,
        permission: "SETTINGS/AUTH_MATRIX/CROSSED/INTEGRATIONS/EDIT",
      },
      {
        path: "auth-matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId/sessions",
        component: SessionsPage,
        permission: "SETTINGS/AUTH_MATRIX/CROSSED/INTEGRATIONS/SESSIONS",
      },
      {
        path: "users",
        component: UsersPage,
        permission: "SETTINGS/USERS",
      },
      {
        path: "users/create",
        component: UsersForm,
        permission: "SETTINGS/USERS/CREATE",
      },
      {
        path: "users/:id",
        component: UsersForm,
        permission: "SETTINGS/USERS/EDIT",
      },
      {
        path: "phases",
        component: PhasesPage,
        permission: "SETTINGS/PHASES",
      },
      {
        path: "phases/create",
        component: PhasesForm,
        permission: "SETTINGS/USERS/CREATE",
      },
      {
        path: "phases/:id",
        component: PhasesForm,
        permission: "SETTINGS/USERS/EDIT",
      },
      {
        path: "positions",
        component: PositionsPage,
        permission: "SETTINGS/POSTIONS",
      },
      {
        path: "positions/create",
        component: PositionsForm,
        permission: "SETTINGS/POSTIONS/CREATE",
      },
      {
        path: "positions/:id",
        component: PositionsForm,
        permission: "SETTINGS/POSTIONS/EDIT",
      },
      {
        path: "stage_statuses",
        component: StageStatusesPage,
        permission: "SETTINGS/STAGE_STATUSES",
      },
      {
        path: "spheres",
        component: SpheresPage,
        permission: "SETTINGS/SPHERES",
      },
      {
        path: "spheres/create",
        component: SpheresForm,
        permission: "SETTINGS/SPHERES/CREATE",
      },
      {
        path: "spheres/:id",
        component: SpheresForm,
        permission: "SETTINGS/SPHERES/EDIT",
      },
    ],
  },
  {
    path: "workload",
    component: Workload,
    permission: "WORKLOAD",
  },
]
