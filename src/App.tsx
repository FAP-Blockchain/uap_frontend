import { Suspense, lazy, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { Spin } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  adminRoutes,
  studentPortalRoutes,
  teacherRoutes,
  type RouteConfig,
} from "./config/appRoutes";
import { setNavigate } from "./utils/navigation";

// Lazy load auth pages
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const PublicHome = lazy(() => import("./pages/PublicPortal/Home"));
const VerificationPortal = lazy(
  () => import("./pages/PublicPortal/VerificationPortal")
);
const VerificationResults = lazy(
  () => import("./pages/PublicPortal/VerificationResults")
);
const VerificationHistory = lazy(
  () => import("./pages/PublicPortal/VerificationHistory")
);
const AboutHelp = lazy(() => import("./pages/PublicPortal/AboutHelp"));

// Loading fallback component
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <Spin size="large" tip="Đang tải..." />
  </div>
);

// Helper function to wrap route element with Suspense
const wrapWithSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

// Helper function to process route config and add Suspense
const processRoute = (route: RouteConfig): RouteConfig => {
  const processedRoute: RouteConfig = {
    ...route,
    element: route.element ? wrapWithSuspense(route.element) : undefined,
  };

  if (route.children) {
    processedRoute.children = route.children.map(processRoute);
  }

  return processedRoute;
};

// Root component to initialize navigation utility
const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <Outlet />;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          index: true,
          element: wrapWithSuspense(<PublicHome />),
        },
        {
          path: "/login",
          element: wrapWithSuspense(<Login />),
        },
        {
          path: "/forgot-password",
          element: wrapWithSuspense(<ForgotPassword />),
        },
        {
          path: "/change-password",
          element: wrapWithSuspense(<ChangePassword />),
        },
        // Public Portal Routes (at root level)
        {
          path: "/verify",
          element: wrapWithSuspense(<VerificationPortal />),
        },
        {
          path: "/results",
          element: wrapWithSuspense(<VerificationResults />),
        },
        {
          path: "/certificates/verify/:credentialId",
          element: wrapWithSuspense(<VerificationResults />),
        },
        {
          path: "/history",
          element: wrapWithSuspense(<VerificationHistory />),
        },
        {
          path: "/help",
          element: wrapWithSuspense(<AboutHelp />),
        },
        // Process all route configs with Suspense
        processRoute(studentPortalRoutes),
        processRoute(adminRoutes),
        processRoute(teacherRoutes),
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
