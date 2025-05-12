import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import studentApi from "../api/studentApi";

const PrivateRoute = () => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Kiểm tra token bằng cách gọi API lấy thông tin user
        await studentApi.getDataStudent();
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
