import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminLogin from "./pages/AdminLogin";
import TeacherVacancy from "./pages/TeacherVacancy";
import Subscriptions from "./pages/Subscriptions";
import Biodata from "./pages/Profile/Biodata";
import AddTeacher from "./pages/AddTeacher";
import ViewTeachers from "./pages/ViewTeachers";
import Dashboard from "./pages/AdminDashboard";
import AdminVacancy from "./pages/AdminVacancy";
import SendEmail from "./pages/SendEmail";
import SuperDashboard from "./pages/SuperDashboard";
import AddVacancy from "./pages/AddVacancy";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="profile" element={<Biodata />} />
            <Route path="vacancy" element={<TeacherVacancy />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/addteacher" element={<AddTeacher />} />
            <Route path="admin/viewteachers" element={<ViewTeachers />} />
            <Route path="admin/sendmail/:jobId" element={<SendEmail />} />
            <Route path="admin/vacancy" element={<AdminVacancy />} />
            <Route path="superadmin/dashboard" element={<SuperDashboard />} />
            <Route path="admin/createvacancy" element={<AddVacancy />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
