import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { lazy, Suspense, useEffect } from "react";
import FallbackPage from "./views/Fallback";
import PaymentForm from "./views/ProjectDetail/Payment/PaymentForm";
import { format, startOfWeek } from "date-fns";
import workloadService from "./services/workloadService";
import { workloadActions } from "./redux/slices/workload.slice";
const StatusesPage = lazy(() => import("./views/Projects/Statuses"));
const ProjectPositionsPage = lazy(() => import("./views/Projects/Positions"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const BacklogPage = lazy(() => import("./views/ProjectDetail/Backlog"));
const ListView = lazy(() => import("./views/ProjectDetail/ListView"));
const BoardPage = lazy(() => import("./views/ProjectDetail/Board"));
const GanttPage = lazy(() => import("./views/ProjectDetail/Gantt"));
const ProjectsPage = lazy(() => import("./views/Projects"));

const ProjectForm = lazy(() => import("./views/Projects/Form"));
const ProjectDetail = lazy(() => import("./views/ProjectDetail"));
const PhasesPage = lazy(() => import("./views/Phases"));
const PhasesForm = lazy(() => import("./views/Phases/Form"));
const PositionsPage = lazy(() => import("./views/Positions"));
const PositionsForm = lazy(() => import("./views/Positions/Form"));
const StageStatusesPage = lazy(() => import("./views/StageStatuses"));
const SpheresPage = lazy(() => import("./views/Spheres"));
const SpheresForm = lazy(() => import("./views/Spheres/Form"));
const ProjectDashboard = lazy(() =>
  import("./views/ProjectDetail/ProjectDashboard")
);
const LoginPage = lazy(() => import("./views/Login"));
const ForgetPasswordpage = lazy(() =>
  import("./views/Login/ForgetPasswordPage")
);

const SprintDetailPage = lazy(() => import("./views/SprintDetail"));
const ProjectFiles = lazy(() => import("./views/ProjectDetail/Files"));
const AuthMatrix = lazy(() => import("./views/AuthMatrix"));
const Notes = lazy(() => import("./views/ProjectDetail/Notes"));
const Payment = lazy(() => import("./views/ProjectDetail/Payment"));
const ClientPlatform = lazy(() => import("./views/AuthMatrix/ClientPlatform"));
const ClientType = lazy(() => import("./views/AuthMatrix/ClientType"));
const UsersPage = lazy(() => import("./views/Users"));
const UsersForm = lazy(() => import("./views/Users/Form"));
const MembersGroupPage = lazy(() => import("./views/MembersGroup"));
const MembersGroupForm = lazy(() => import("./views/MembersGroup/Form"));
const MembersGroupWrapper = lazy(() =>
  import("./views/MembersGroup/MembersGroupWrapper")
);
const MembersPage = lazy(() => import("./views/MembersGroup/Members"));
const MembersForm = lazy(() => import("./views/MembersGroup/Members/Form"));
const ProjectCreateForm = lazy(() => import("./views/Projects/CreateForm"));
const TestPage = lazy(() => import("./views/TestPage"));
const CrossedPage = lazy(() => import("./views/AuthMatrix/Crossed"));
const RolesForm = lazy(() => import("./views/AuthMatrix/Crossed/Roles/Form"));
const IntegrationsForm = lazy(() =>
  import("./views/AuthMatrix/Crossed/Integrations/Form")
);
const SessionsPage = lazy(() =>
  import("./views/AuthMatrix/Crossed/Integrations/Sessions")
);
const Workload = lazy(() => import("./views/Workload"));
const Standups = lazy(() => import("./views/Standups"));
const Finance = lazy(() => import("./views/Finance"));
const Report = lazy(() => import("./views/Report"));
const TestPlan = lazy(() => import("./views/TestPlan"));

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);

  const getWorkload = () => {
    workloadService
      .getWorkload({
        start_date: format(
          startOfWeek(new Date(), { weekStartsOn: 1 }),
          "yyyy-MM-dd"
        ),
      })
      .then((res) => {
        dispatch(
          workloadActions.setWorkloadProjects(
            res?.projects?.sort(function (a, b) {
              return a?.order_number - b?.order_number;
            })
          )
        );
      })
      .catch((err) => {
        dispatch(workloadActions.setWorkloadProjects([]));
        dispatch(workloadActions.setWorkloadPlans([]));
      });
  };

  const getWorkloadPlan = () => {
    workloadService
      .getWorkloadPlan({
        start_date: format(
          startOfWeek(new Date(), { weekStartsOn: 1 }),
          "yyyy-MM-dd"
        ),
      })
      .then((res) => {
        dispatch(
          workloadActions.setWorkloadPlans(
            res?.plan_fact?.sort((a, b) => {
              if (a?.role_id < b?.role_id) return -1;
              if (a?.role_id > b?.role_id) return 1;
              return 0;
            })
          )
        );
      })
      .catch((err) => {
        console.log("Err", err);
        dispatch(workloadActions.setWorkloadPlans([]));
      });
  };

  useEffect(() => {
    const today = new Date();
    const date = localStorage.getItem("date");
    if (Number(date) !== today.getDate()) {
      localStorage.setItem("date", today.getDate());
      getWorkloadPlan();
      getWorkload();
    } else {
    }
  }, []);

  return (
    <div className="App">
      {!isAuth ? (
        <Routes>
          <Route
            path="/login"
            element={
              <Suspense fallback={<FallbackPage />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<FallbackPage />}>
                <ForgetPasswordpage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<FallbackPage />}>
                <MainLayout />
              </Suspense>
            }
          ></Route>
          <Route
            path="/"
            element={
              <Suspense fallback={<FallbackPage />}>
                <MainLayout />
              </Suspense>
            }
          >
            <Route index element={<Navigate to="/projects" />} />

            <Route
              path="projects"
              element={
                <Suspense fallback={<FallbackPage />}>
                  <ProjectsPage />
                </Suspense>
              }
            >
              <Route index element={<Navigate to="/projects/statuses" />} />
              <Route
                path="statuses"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <StatusesPage />
                  </Suspense>
                }
              />
              <Route
                path="positions"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <ProjectPositionsPage />
                  </Suspense>
                }
              />
            </Route>
            <Route
              path="projects/phase/:phaseId/create"
              element={
                <Suspense fallback={<FallbackPage />}>
                  <ProjectCreateForm />
                </Suspense>
              }
            />
            <Route
              path="projects/:projectId"
              element={
                <Suspense fallback={<FallbackPage />}>
                  <ProjectDetail />
                </Suspense>
              }
            >
              <Route
                path="dashboard"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <ProjectDashboard />
                  </Suspense>
                }
              />
              <Route
                path="members-group"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <MembersGroupWrapper />
                  </Suspense>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<FallbackPage />}>
                      <MembersGroupPage />
                    </Suspense>
                  }
                />
                <Route
                  path="create"
                  element={
                    <Suspense fallback={<FallbackPage />}>
                      <MembersGroupForm />
                    </Suspense>
                  }
                />
                <Route
                  path=":membersGroupId"
                  element={
                    <Suspense fallback={<FallbackPage />}>
                      <MembersGroupForm />
                    </Suspense>
                  }
                />
                <Route
                  path=":membersGroupId/members"
                  element={
                    <Suspense fallback={<FallbackPage />}>
                      <MembersPage />
                    </Suspense>
                  }
                />
                <Route
                  path=":membersGroupId/members/:memberId"
                  element={
                    <Suspense fallback={<FallbackPage />}>
                      <MembersForm />
                    </Suspense>
                  }
                />
                <Route
                  path=":membersGroupId/members/create"
                  element={
                    <Suspense fallback={<FallbackPage />}>
                      <MembersForm />
                    </Suspense>
                  }
                />
              </Route>

              <Route
                path="info"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <ProjectForm />
                  </Suspense>
                }
              />
              <Route
                path="backlog"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <BacklogPage />
                  </Suspense>
                }
              />
              <Route
                path="list"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <ListView />
                  </Suspense>
                }
              />
              <Route
                path="sprint/:sprintId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <SprintDetailPage />
                  </Suspense>
                }
              ></Route>
              <Route
                path="board/:typeId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <BoardPage />
                  </Suspense>
                }
              />
              <Route
                path="gantt"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <GanttPage />
                  </Suspense>
                }
              />
              <Route
                path="files/:folderId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <ProjectFiles />
                  </Suspense>
                }
              />
              <Route
                path="note"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <Notes />
                  </Suspense>
                }
              />
              <Route
                path="payment"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <Payment />
                  </Suspense>
                }
              />
              <Route
                path="payment/create"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <PaymentForm />
                  </Suspense>
                }
              />
              <Route
                path="payment/:financeId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <PaymentForm />
                  </Suspense>
                }
              />
              <Route
                path="test-plan"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <TestPlan />
                  </Suspense>
                }
              />
              <Route
                path="test-plan/:testId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <TestPlan />
                  </Suspense>
                }
              />
            </Route>
            <Route
              path="workload"
              element={
                <Suspense fallback={<FallbackPage />}>
                  <Workload />
                </Suspense>
              }
            />
            <Route
              path="standups"
              element={
                <Suspense fallback={<FallbackPage />}>
                  <Standups />
                </Suspense>
              }
            />
            <Route
              path="standups/report"
              element={
                <Suspense fallback={<FallbackPage />}>
                  <Report />
                </Suspense>
              }
            />
            <Route
              path="finance"
              element={
                <Suspense fallback={<FallbackPage />}>
                  <Finance />
                </Suspense>
              }
            />

            <Route path="settings">
              <Route
                path="auth-matrix/:projectId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <AuthMatrix />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/platform/:platformId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <ClientPlatform />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/client-type/:typeId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <ClientType />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/:platformId/:typeId/crossed"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <CrossedPage />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/:platformId/:typeId/crossed/user/create"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <UsersForm />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/:platformId/:typeId/crossed/user/:userId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <UsersForm />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/:platformId/:typeId/crossed/role/create"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <RolesForm />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/:platformId/:typeId/crossed/role/:roleId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <RolesForm />
                  </Suspense>
                }
              />

              <Route
                path="auth-matrix/:projectId/:platformId/:typeId/crossed/integration/create"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <IntegrationsForm />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <IntegrationsForm />
                  </Suspense>
                }
              />
              <Route
                path="auth-matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId/sessions"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <SessionsPage />
                  </Suspense>
                }
              />

              <Route
                path="users"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <UsersPage />
                  </Suspense>
                }
              />
              <Route
                path="users/create"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <UsersForm />
                  </Suspense>
                }
              />
              <Route
                path="users/:id"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <UsersForm />
                  </Suspense>
                }
              />

              <Route
                path="phases"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <PhasesPage />
                  </Suspense>
                }
              />
              <Route
                path="phases/create"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <PhasesForm />
                  </Suspense>
                }
              />
              <Route
                path="phases/:id"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <PhasesForm />
                  </Suspense>
                }
              />

              <Route
                path="positions"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <PositionsPage />
                  </Suspense>
                }
              />
              <Route
                path="positions/create"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <PositionsForm />
                  </Suspense>
                }
              />
              <Route
                path="positions/:id"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <PositionsForm />
                  </Suspense>
                }
              />

              <Route
                path="stage_statuses"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <StageStatusesPage />
                  </Suspense>
                }
              />
              <Route
                path="spheres"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <SpheresPage />
                  </Suspense>
                }
              />
              <Route
                path="spheres/create"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <SpheresForm />
                  </Suspense>
                }
              />
              <Route
                path="spheres/:id"
                element={
                  <Suspense fallback={<FallbackPage />}>
                    <SpheresForm />
                  </Suspense>
                }
              />
            </Route>

            <Route
              path="remote"
              element={
                <Suspense fallback={<FallbackPage />}>
                  <TestPage />
                </Suspense>
              }
            />

            <Route path="*" element={<Navigate to="/projects" />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}

export default App;
