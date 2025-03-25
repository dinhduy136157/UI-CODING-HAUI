import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/User/auth/Login";
import Home from "../pages/User/Home";
import Lesson from "../pages/User/Lesson";
import LessonDetail from "../pages/User/LessonDetail";
import PrivateRoute from "./PrivateRoutes"; // Import



const UserRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        {/* Bảo vệ các route cần đăng nhập */}
        <Route element={<PrivateRoute />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/Lesson" element={<Lesson />} />
          <Route path="/LessonDetail" element={<LessonDetail />} />
        </Route>

        {/* Mặc định về trang login nếu route không tồn tại */}
        <Route path="/*" element={<Navigate to="/login" />} />
        

      </Routes>
    </Router>
  );
};

export default UserRoutes;
