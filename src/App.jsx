import { Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage";
import HomePage from "./Pages/HomePage/Homepage";
// import LoginWithFaceId from './Pages/LoginPage/LoginFaceId';
import RestrictedAccessPage from "./Pages/RestrictedAccessPage/RestrictedAccessPage";
import DashboardPage from "./Pages/Dashboard/Dashboard";
import WorkspaceLogin from "./Pages/Workspace/WorkspaceLogin";
import WorkspaceReport from "./Pages/Workspace/WorkspaceReport";
import WorkspaceUserDetails from "./Pages/Workspace/WorkspaceUserDetails";
import WorkspaceScaleDetails from "./Pages/Workspace/WorkspaceScaleDetails";
import ExhibitionPage from "./Pages/Workspace/ExhibitionPage";

const App = () => {
  return (
    <Routes>
      <Route path="/dowelleducation/" element={<LoginPage />} />
      <Route path="/dowelleducation/home" element={<HomePage />} />
      {/* <Route path="/dowelleducation/faceid" element={<LoginWithFaceId />} /> */}
      <Route
        path="/dowelleducation/restricted-access"
        element={<RestrictedAccessPage />}
      />
      <Route path="/dowelleducation/dashboard" element={<DashboardPage />} />
      {/* New routes for Dowell Workspace  */}
      <Route
        path="/dowelleducation/workspace-login"
        element={<WorkspaceLogin />}
      />
      <Route
        path="/dowelleducation/workspace-report"
        element={<WorkspaceReport />}
      />
      <Route
        path="/dowelleducation/workspace-userdetails"
        element={<WorkspaceUserDetails />}
      />
      <Route
        path="/dowelleducation/workspace-scaledetails"
        element={<WorkspaceScaleDetails />}
      />
      <Route
        path="/dowelleducation/workspace-exhibition"
        element={<ExhibitionPage />}
      />

    </Routes>
  );
};

export default App;
