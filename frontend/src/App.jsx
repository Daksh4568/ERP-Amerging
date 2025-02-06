import React from "react";
import "./app.css";
import PublicRoute from "./components/Atoms/PublicRoute";
import Login from "./components/Molecules/Login";
import ProtectedRoute from "./components/Atoms/ProtectedRoute";
import Dashboard from "./components/Pages/Dashboard";
import JoiningForm from "./Modules/HRModule/JoiningForm";
import SelfEvaluationForm from "./components/Molecules/SelfEvalFrom";
import ExitForm from "./components/Molecules/ExitForm";
import Header from "./components/Organisms/Header";
import NavLinks from "./components/Organisms/NavLinks";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LeaveForm from "./components/Molecules/LeaveForm";
import Notification from "./components/Pages/Notification";
import LeaveApproval from "./components/Molecules/LeaveApproval";
import LeaveStatusPage from "./components/Pages/LeaveStatusPage";
import EmployeeList from "./components/Pages/EmployeeData";
import UserProfile from "./components/Pages/UserProfile";
import { EmpProvider } from "./components/Atoms/EmpContext";
import DailyExpenseForm from "./components/Molecules/DailyExpenseForm";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        <NavLinks />
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
      ],
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/dashboard",
          element: <ProtectedRoute />,
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
            {
              path: "joining-form",
              element: <JoiningForm />,
            },
            {
              path: "selfeval-form",
              element: <SelfEvaluationForm />,
            },
            {
              path: "exit-form",
              element: <ExitForm />,
            },
            {
              path: "leave-form",
              element: <LeaveForm />,
            },
            {
              path: "leave-status",
              element: <LeaveStatusPage />,
            },
          ],
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/notifications",
              element: <Notification />,
            },
          ],
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/leave-approval/:notificationId",
              element: <LeaveApproval />,
            },
          ],
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/admin/employee-data",
              element: <EmployeeList/>,
            }
          ]
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/user-profile",
              element: <UserProfile />,
            }
          ]
        },
        {
          path: "/",
          element: <ProtectedRoute />,
          children: [
            {
              path: "/hr/daily-expenses",
              element: <DailyExpenseForm/>,
            }
          ]
        },
      ],
    },
  ]);

  return  <RouterProvider router={router} />;
  // (  <EmpProvider>
  // </EmpProvider> )
}

export default App;
