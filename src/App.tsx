import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/hoang/Login";
import {
  adminRoutes,
  studentPortalRoutes,
  teacherRoutes,
  publicPortalRoutes,
} from "./config/appRoutes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    studentPortalRoutes,
    adminRoutes,
    teacherRoutes,
    publicPortalRoutes,
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
