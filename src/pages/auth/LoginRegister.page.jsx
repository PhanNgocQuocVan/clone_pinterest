import { useState } from "react";
import LoginModal from "../../component/modal/Login.modal";
import SignupModel from "../../component/modal/Signup.model";
import { useAppContext } from "../../context/appContext";

function LoginRegisterPage() {
  const { isLoginModal } = useAppContext();

  const handleLoginWithGoogle = async () => {
    const base = import.meta.env.VITE_SUPABASE_URL;
    const urlBackend = `${base}/auth/v1/authorize?provider=google`;

    // Redirect browser tới Google login
    window.location.href = urlBackend;
  };

  return (
    <div className=" bg-login-page h-[calc(100vh-80px)] w-screen flex flex-row items-center justify-center sm:justify-between px-6 lg:px-26 pb-[10px]">
      <div className="hidden sm:flex items-center justify-start h-full flex-1 ">
        <h2 className="lg:text-[60px] md:text-[40px] sm:text-[25px] text-[70px] font-[600] text-white max-w-[475px]">
          Đăng nhập để nhận ý tưởng
        </h2>
      </div>
      <div className="h=full flex items-center justify-between ">
        {isLoginModal ? (
          <LoginModal handleLoginWithGoogle={handleLoginWithGoogle} />
        ) : (
          <SignupModel handleLoginWithGoogle={handleLoginWithGoogle} />
        )}
      </div>
    </div>
  );
}

export default LoginRegisterPage;
