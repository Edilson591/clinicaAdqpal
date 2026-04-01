import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/User";
import { LoadingSpinner } from "./Spinner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { logout as logoutAction } from "../../store/authSlice";
import { useTheme } from "../../context/ThemeContext";

function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { disabledTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    userService
      .getById(user.id)
      .catch((err) => {
        console.error(err);
        setIsVerifying(false);
        dispatch(logoutAction());
        disabledTheme();
      })
      .finally(() => setIsVerifying(false));
  }, [isAuthenticated, user?.id, dispatch, disabledTheme]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
