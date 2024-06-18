import { lazy, Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import FallbackPage from "../views/Fallback";
import { authRoutes } from "./authRoutes";
import { mainRoutes } from "./mainRoutes";
const MainLayout = lazy(() => import("../layouts/MainLayout"));

const Router = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const permissions = useSelector((state) => state.auth.permissions);

  const computedMainRoutes = useMemo(() => {
    return mainRoutes
      .filter((route) => permissions[route.permission])
      .map((route) => ({
        ...route,
        children: route.children?.filter(
          (child) => permissions[child.permission]
        ),
      }));
  }, [permissions]);

  const navigateLink = useMemo(() => {
    return computedMainRoutes[0]?.path;
  }, [computedMainRoutes]);

  console.log("COMPUTED MAIN ROUTES", computedMainRoutes, permissions);

  if (!isAuth)
    return (
      <div className="Router">
        <Routes>
          {authRoutes.map((route) => (
            <Route
              path={route.path}
              key={route.path}
              element={
                <Suspense fallback={<FallbackPage />}>
                  <route.component />
                </Suspense>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );

  if (!navigateLink) return null;

  return (
    <div className="Router">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<FallbackPage />}>
              <MainLayout />
            </Suspense>
          }
        >
          {navigateLink && (
            <Route index element={<Navigate to={navigateLink} />} />
          )}
          {computedMainRoutes.map((route) => (
            <Route
              path={route.path}
              key={route.path}
              element={
                route.component && (
                  <Suspense fallback={<FallbackPage />}>
                    <route.component />
                  </Suspense>
                )
              }
            >
              {route.children?.map((childroute) => (
                <Route
                  path={childroute.path}
                  key={childroute.path}
                  element={
                    <Suspense fallback={<FallbackPage />}>
                      <childroute.component />
                    </Suspense>
                  }
                />
              ))}
            </Route>
          ))}
          <Route path="*" element={<Navigate to={navigateLink} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Router;
