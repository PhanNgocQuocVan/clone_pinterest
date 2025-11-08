import React from "react";
import { useAuthContex } from "../../context/AuthContext";
import avatarDefaul from "../../accset/logo/avatar-defaul.png";
import { logOutAPI } from "../../services/api.services";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function UserInfoMenu({ className }) {
  const { infoUser } = useAuthContex();
  const navigate = useNavigate();

  const handelLogout = async () => {
    try {
      await logOutAPI();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      toast.success("đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("đăng xuất thất bại");
    }
  };
  return (
    <div
      className={`gap-5 absolute shadow-2xl flex whitespace-nowrap flex-col p-3 bg-white rounded-2xl items-start md:w-[360px] w-[300px] ${className}`}
    >
      <div className="flex flex-col w-full items-start gap-1 cursor-pointer">
        <p className="text-[#72726c] text-[12px] font-[500] p-3">
          Đang đăng nhập
        </p>
        <Link
          to="/profile"
          className="flex flex-row gap-3 justify-start w-full rounded-2xl hover_nemu p-3"
        >
          <img
            className="h-[60px] w-[60px] rounded-full object-cover "
            src={infoUser?.avatar_url || avatarDefaul}
            alt=""
          />
          <div className="flex flex-col items-start justify-between py-1">
            <p className="font-bold ">{infoUser?.full_name}</p>
            <p className="text-color text-[14px]">{infoUser?.email}</p>
          </div>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <p className="text-[#72726c] text-[12px] font-[500] pl-3">
          Tài khoản của bạn
        </p>
        <div
          onClick={handelLogout}
          className="w-full rounded-xl hover_nemu cursor-pointer p-3 font-[500]"
        >
          Đăng xuất
        </div>
      </div>
    </div>
  );
}

export default UserInfoMenu;
