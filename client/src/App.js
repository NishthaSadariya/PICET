import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/Register.jsx";
import UploadResearchPaper from "./Pages/Upload.jsx";
import AdminPaper from "./Pages/AdminPaper.jsx";
import EvaluatorPaper from "./Pages/EvaluatorPaper.jsx";
import GivePermission from "./Pages/GivePermission.jsx";
import ListOfEvaluatior from "./Pages/ListOfEvaluatior.jsx";
import EvaluateResearchPaper from "./Pages/Evaluate.jsx";
import EditEvaluateResearchPaper from "./Pages/EditEvaluateResearchPaper.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ProtecteRoute from "./components/ProtecteRoute.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import TopRatedPapers from "./Pages/TopRatedPapers.jsx";

function Layout() {
  const token = localStorage.getItem("token"); // Check if logged in

  return (
    <>
      {token && <Header />}
      <main className="content">
        <Outlet />
      </main>
      {token && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes for all authenticated users */}
        <Route element={<ProtecteRoute allowedRoles={["admin", "evaluator"]} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/evaluate/:rid" element={<EvaluateResearchPaper />} />
            <Route path="/edit-evaluate/:rid" element={<EditEvaluateResearchPaper />} />
          </Route>
        </Route>

        {/* Evaluator-Only Routes */}
        <Route element={<ProtecteRoute allowedRoles={["evaluator"]} />}>
          <Route element={<Layout />}>
            <Route path="/evaluator/papers" element={<EvaluatorPaper />} />
            <Route path="/evaluator/papers/category/:category" element={<EvaluatorPaper />} />
            <Route path="/SelectTopPapers" element={<TopRatedPapers />} />
          </Route>
        </Route>

        {/* Admin-Only Routes */}
        <Route element={<ProtecteRoute allowedRoles={["admin"]} />}>
          <Route element={<Layout />}>
            <Route path="/admin/papers" element={<AdminPaper />} />
            <Route path="/admin/papers/category/:category" element={<AdminPaper />} />
            <Route path="/upload" element={<UploadResearchPaper />} />
            <Route path="/givePermission" element={<GivePermission />} />
            <Route path="/list" element={<ListOfEvaluatior />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
