import {Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/User/auth/Login";
import Home from "../pages/User/Home";
import Lesson from "../pages/User/Lesson";
import LessonDetail from "../pages/User/LessonDetail";
import PrivateRoute from "./PrivateRoutes"; // Import
import CodingExercise from "../pages/User/CodingExercise";
import ScoreOverview from "../pages/User/ScoreOverview";
import ScoreDetail from "../pages/User/ScoreDetail";




const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/Lesson" element={<Lesson />} />
        <Route path="/LessonDetail" element={<LessonDetail />} />
        <Route path="/CodingExercise" element={<CodingExercise />} />
        <Route path="/ScoreOverview" element={<ScoreOverview />} />
        <Route path="/ScoreDetail/:classId" element={<ScoreDetail />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
