import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth2faCard from "../../components/ui/Auth2faCard";
import { useAuth2faForm } from "../../hooks/useAuth2faForm";
import { useAuth } from "../../context/AuthContext";

export function Auth2faPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    register,
    errors,
    generalError,
    resendMessage,
    email,
    isLoading,
    isResending,
    onSubmit,
    onResend,
    onBackToLogin,
    hasTempToken,
  } = useAuth2faForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    if (!hasTempToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate, hasTempToken]);

  if (!hasTempToken) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #38a169 100%)",
      }}
    >
      <Auth2faCard
        register={register}
        errors={errors}
        generalError={generalError}
        resendMessage={resendMessage}
        email={email}
        isLoading={isLoading}
        isResending={isResending}
        onSubmit={onSubmit}
        onResend={onResend}
        onBackToLogin={onBackToLogin}
      />
    </div>
  );
}

export default Auth2faPage;
