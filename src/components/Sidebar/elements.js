import {
  Bookmark,
  Settings,
  ManageAccounts,
  Person,
  PivotTableChart,
  GridView,
  WorkOutline,
  Campaign,
  AttachMoney,
} from "@mui/icons-material"

const routes = [
  {
    id: "projects",
    title: "Projects",
    path: "/projects",
    icon: GridView,
    permission: "PROJECTS",
  },
  {
    id: "workload",
    title: "Workload",
    path: "/workload",
    icon: WorkOutline,
    permission: "ROOT",
    isChild: true,
  },
  {
    id: "standups",
    title: "StandUps",
    path: "/standups",
    icon: Campaign,
    permission: "ROOT",
    isChild: true,
  },
  {
    id: "finance",
    title: "Finance",
    path: "/finance",
    icon: AttachMoney,
    permission: "FINANCE",
    isChild: true,
  },
  {
    id: "settings",
    title: "Settings",
    path: "/settings",
    icon: Settings,
    permission: "SETTINGS",
    children: [
      {
        id: "auth-matrix",
        title: "Auth matrix",
        path: `/settings/auth-matrix/e04766bc-3228-4cd9-bd22-09e3fa27a6be`,
        icon: PivotTableChart,
        isChild: true,
        permission: "SETTINGS/AUTH_MATRIX",
      },
      {
        id: "users",
        title: "Users",
        path: `/settings/users`,
        icon: Person,
        isChild: true,
        permission: "SETTINGS/USERS",
      },
      {
        id: "phases",
        title: "Phases",
        path: "/settings/phases",
        icon: Bookmark,
        isChild: true,
        permission: "SETTINGS/PHASES",
      },
      {
        id: "positions",
        title: "Positions",
        path: "/settings/positions",
        icon: ManageAccounts,
        isChild: true,
        permission: "SETTINGS/POSITIONS",
      },
      {
        id: "stage_statuses",
        title: "Stages and statuses",
        path: "/settings/stage_statuses",
        icon: ManageAccounts,
        isChild: true,
        permission: "SETTINGS/POSITIONS", // TODO: change permission
      },
    ],
  },
]

export default routes
