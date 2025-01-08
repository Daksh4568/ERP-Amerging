import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" elements={<Layout />}>
//       {/* Public route */}
//       <Route element={<PublicRoute />}>
//         <Route path="/" element={<Login />} />
//       </Route>

//       {/* protected routes */}
//       <Route element={<ProtectedRoute />}>
//         <Route path="dashboard" element={<Dashboard />}>
//           <Route className="" path="joining-form" element={<JoiningForm />} />
//           <Route path="selfeval-form" element={<SelfEvalFrom />} />
//           <Route path="exit-form" element={<ExitForm />} />
//         </Route>
//       </Route>
//     </Route>
//   )
// );

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <RouterProvider router={router} /> */}
    <App />
  </StrictMode>
);
