import {
  Bell,
  ChevronDown,
  Compass,
  House,
  MessageCircle,
  Search,
  Settings,
  SquarePlus,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import avatarDefaul from "../accset/logo/avatar-defaul.png";
import { useAuthContex } from "../context/AuthContext";
import Tooltip from "../component/tooltip";
import CompassMenu from "../component/Dropdown_menu/CompassMenu";
import UserInfoMenu from "../component/Dropdown_menu/UserInfoMenu";
import { useEffect, useRef, useState } from "react";

function MainLayot() {
  const { infoUser } = useAuthContex();
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const MenuInfoRef = useRef();
  const sreachRef = useRef();
  const navigate = useNavigate();
  const [active, setActive] = useState("House");

  const handelSreach = (e) => {
    const sreachValue = sreachRef.current.value;
    if (e.key == "Enter" && sreachValue) {
      navigate(`/sreach?q=${sreachValue}`);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (MenuInfoRef.current && !MenuInfoRef.current.contains(e.target)) {
        setIsOpenUserMenu(false);
        // click ngoài => đóng menu
      }
    }
    if (isOpenUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenUserMenu]);

  return (
    <div className="flex w-full">
      {/* menu left */}
      <div className=" z-100 fixed bg-white border-r-[#00000026] border-r-[1px] flex flex-col items-center justify-between h-[100vh] w-[75px] py-8">
        <div className=" flex flex-col gap-5">
          <Link
            to="/"
            className="relative group h-[48px] w-[48px] flex items-center justify-center cursor-pointer"
          >
            <div className="modal_Logo h-[24px] w-[24px]"></div>
            <Tooltip className="left-full top-1/2 -translate-y-1/2">
              Trang chủ
            </Tooltip>
          </Link>
          <Link
            onClick={() => setActive("House")}
            to="/"
            className={`${
              active == "House" ? "bg-[#18181661] hover:bg-[#18181661]" : ""
            } relative group h-[48px] w-[48px] flex items-center justify-center cursor-pointer rounded-[16px] hover:bg-[#18181612]`}
          >
            <House />
            <Tooltip className="left-full top-1/2 -translate-y-1/2">
              Trang chủ
            </Tooltip>
          </Link>
          <Link
            onClick={() => setActive("Compass")}
            className={`${
              active == "Compass" ? "bg-[#18181661] hover:bg-[#18181661]" : ""
            } relative group h-[48px] w-[48px] flex items-center justify-center cursor-pointer rounded-[16px] hover:bg-[#18181612]`}
          >
            <Compass />
            <CompassMenu className="left-full top-1/2 -translate-y-1/2" />
          </Link>
          <Link
            onClick={() => setActive("SquarePlus")}
            to="upload"
            className={`${
              active == "SquarePlus"
                ? "bg-[#18181661] hover:bg-[#18181661]"
                : ""
            } relative group h-[48px] w-[48px] flex items-center justify-center cursor-pointer rounded-[16px] hover:bg-[#18181612]`}
          >
            <SquarePlus />
            <Tooltip className="left-full top-1/2 -translate-y-1/2">
              Tạo
            </Tooltip>
          </Link>
          <div
            onClick={() => setActive("Bell")}
            className={`${
              active == "Bell" ? "bg-[#18181661] hover:bg-[#18181661]" : ""
            } relative group h-[48px] w-[48px] flex items-center justify-center cursor-pointer rounded-[16px] hover:bg-[#18181612]`}
          >
            <Bell />
            <Tooltip className="left-full top-1/2 -translate-y-1/2">
              Cập nhật{" "}
            </Tooltip>
          </div>
          <Link
            to={"/messages"}
            onClick={() => setActive("Message")}
            className={`${
              active == "Message" ? "bg-[#18181661] hover:bg-[#18181661]" : ""
            } relative group h-[48px] w-[48px] flex items-center justify-center cursor-pointer rounded-[16px] hover:bg-[#18181612]`}
          >
            <MessageCircle />
            <Tooltip className="left-full top-1/2 -translate-y-1/2">
              Tin nhắn{" "}
            </Tooltip>
          </Link>
        </div>

        <div
          onClick={() => setActive("Settings")}
          className={`${
            active == "Settings" ? "bg-[#18181661] hover:bg-[#18181661]" : ""
          } relative group h-[48px] w-[48px] flex items-center justify-center cursor-pointer rounded-[16px] hover:bg-[#18181612]`}
        >
          <Settings />
          <Tooltip className="left-full top-1/2 -translate-y-1/2">
            Cài đặt và Hỗ trợ{" "}
          </Tooltip>
        </div>
      </div>

      {/* menu top */}
      <div className="ml-[74px] w-full">
        <div className="  z-99 w-[calc(100%-74px)] fixed bg-white gap-3 h-[80px] flex items-center justify-between px-5">
          <div className="hover:bg-[#e1e1e1] px-5 gap-2 flex flex-1 bg-[#f1f1f1] h-[48px] rounded-2xl items-center justify-center">
            <Search className="size-[16px] text-[#62625B]" />
            <input
              ref={sreachRef}
              onKeyDown={handelSreach}
              className="w-[100%] h-full text-[#2f2f2ad6] font-[500] text-[16px] "
              type="text"
              placeholder="Tìm kiếm"
            />
          </div>

          <div className="flex flex-row items-center justify-center gap-1">
            <Link to="/profile" className="relative group">
              <img
                className="size-[32px] object-cover rounded-full cursor-pointer"
                src={infoUser?.avatar_url || avatarDefaul}
                alt=""
              />
              <Tooltip className="-bottom-10 left-1/2 -translate-x-1/2">
                Hồ sơ của bạn
              </Tooltip>
            </Link>
            <div ref={MenuInfoRef} className=" relative">
              {isOpenUserMenu ? (
                <UserInfoMenu className="top-[100%] mt-5 -right-3" />
              ) : (
                ""
              )}
              <div
                onClick={() => setIsOpenUserMenu(!isOpenUserMenu)}
                className="group"
              >
                <ChevronDown className="text-[#8e8e89] cursor-pointer" />
                <Tooltip className="-bottom-10 left-1 -translate-x-1/2">
                  Tài khoản
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <main className="pt-[80px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayot;
