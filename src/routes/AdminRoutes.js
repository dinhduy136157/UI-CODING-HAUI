import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/Admin/AdminLayout';
import DashboardPage from '../pages/Admin/Dashboard';
import StudentsPage from '../pages/Admin/Students';
import Submissions from '../pages/Admin/Submission';
import ExerciseForm from '../pages/Admin/ExerciseForm';
import Exercises from '../pages/Admin/Exercises';
import ClassDetail from '../pages/Admin/ClassDetail';
import ClassList from '../pages/Admin/ClassList';
import LessonContentManager from '../pages/Admin/LessonContentManager';
import LessonDetail from '../pages/Admin/LessonDetail';
import Login from '../pages/Admin/auth/Login';
import PrivateRoute from "./PrivateRouteAdmin";
import CourseList from "../pages/Admin/CourseList";
import CourseDetail from "../pages/Admin/CourseDetail";
import ClassForm from "../pages/Admin/ClassForm";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="exercises/:id/submissions" element={<Submissions />} />     
          {/* Phần quản lý học phần */}
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/:courseId/lessons" element={<CourseDetail />} />


          {/* Phần quản lý lớp học*/}
          <Route path="classes" element={<ClassList />} />
          <Route path="classes/new" element={<ClassForm />} />

          <Route path="classes/:classId/lessons" element={<ClassDetail />} />
          <Route path="classes/:classId/students" element={<StudentsPage />} />
          <Route path="lessons/:lessonId" element={<LessonDetail />} />
          <Route path="lesson/:lessonId/LessonContentManager" element={<LessonContentManager />} />
          {/* Phần coding exercise */}
          <Route path="lessons/:lessonId/exercises" element={<Exercises />} />
          <Route path="lessons/:lessonId/exercises/new" element={<ExerciseForm />} />
          <Route path="lessons/:lessonId/exercises/:id/edit" element={<ExerciseForm />} />
          {/* Phần submission */}
          <Route path="lessons/:lessonId/exercises/:id/submissions" element={<Submissions />} />
        </Route>
      </Route>
    </Routes>
  );
}