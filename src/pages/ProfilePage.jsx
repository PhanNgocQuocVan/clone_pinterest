import React, { useEffect, useRef, useState } from "react";
import { useAuthContex } from "../context/AuthContext";
import {
  getPinsUserAPI,
  getProfileAPI,
  getUserLikedPinsAPI,
} from "../services/api.services";
import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import UpdataUserInfoModal from "../component/modal/UpdataUserInfo.modal";
import defaulAvatar from "../accset/logo/avatar-defaul.png";
import UpdataPinInfoModal from "../component/modal/UpdataPinInfo.modal";
import { useQuery } from "@tanstack/react-query";

function ProfilePage() {
  const [active, setActive] = useState("upMenu");
  const { userID, infoUser } = useAuthContex();
  const upMenuRef = useRef();
  const likedMenuRef = useRef();
  const [left, setLeft] = useState();
  const [width, setWidth] = useState();
  const [isOpenModalUser, setIsOpenModalUser] = useState(false);
  const [isOpenModalPin, setIsOpenModalPin] = useState(false);
  const [pinTarget, setPintarget] = useState();

  const getProfile = async () => {
    const res = await getProfileAPI(userID);
    if (res) {
      return res[0];
    }
  };

  const handelChooeMenu = () => {
    if (active == "upMenu") {
      setLeft(upMenuRef.current.offsetLeft);
      setWidth(upMenuRef.current.offsetWidth);
    }
    if (active == "likeMenu") {
      setLeft(likedMenuRef.current.offsetLeft);
      setWidth(likedMenuRef.current.offsetWidth);
    }
  };

  const getPinsUser = async () => {
    const res = await getPinsUserAPI(userID);
    return res;
  };

  const getUserLikedPins = async () => {
    const res = await getUserLikedPinsAPI(userID);
    return res;
  };
  useEffect(() => {
    handelChooeMenu();
  }, [active]);

  const dataProfile = useQuery({
    queryKey: ["Profile"],
    queryFn: getProfile,
  });
  const upPins = useQuery({
    queryKey: ["upPins"],
    queryFn: getPinsUser,
  });
  const likePins = useQuery({
    queryKey: ["likePins"],
    queryFn: getUserLikedPins,
  });

  return (
    <div className="w-full">
      {isOpenModalUser && (
        <UpdataUserInfoModal
          setIsOpenModalUser={setIsOpenModalUser}
          isOpenModalUser={isOpenModalUser}
          dataProfile={dataProfile.data}
        />
      )}
      {isOpenModalPin && (
        <UpdataPinInfoModal
          setIsOpenModalPin={setIsOpenModalPin}
          isOpenModalPin={isOpenModalPin}
          pinTarget={pinTarget}
        />
      )}

      <div className="w-full flex flex-col gap-5 items-center justify-center">
        <img
          className="rounded-full size-[180px] object-cover"
          src={dataProfile.data?.avatar_url || defaulAvatar}
          alt=""
        />
        <div className="flex flex-col items-center justify-center">
          <p className="text-[36px] font-[700] relative">
            {dataProfile.data?.full_name}
            <PenLine
              onClick={() => setIsOpenModalUser(!isOpenModalUser)}
              className="size-5 absolute -right-10 top-[50%] -translate-y-[30%] cursor-pointer"
            />
          </p>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${infoUser.email}`}
            target="_blank"
            rel="noopener"
            className="text-[14px] font-[500] cursor-pointer"
          >
            {infoUser?.email}
          </a>
        </div>
      </div>
      <div>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-row gap-3 justify-center items-center mt-10 relative ">
            <div
              onClick={() => setActive("upMenu")}
              ref={upMenuRef}
              className="text-[16px] font-[500] cursor-pointer"
            >
              <p>Của tôi</p>
            </div>
            <div
              onClick={() => setActive("likeMenu")}
              ref={likedMenuRef}
              className="text-[16px] font-[500] cursor-pointer"
            >
              <p>Đã tim</p>
            </div>
            <div
              style={{ left, width }}
              className={`bg-[#211922] h-[2px] rounded-full absolute -bottom-[2px] transition-all duration-300 ease-in-out`}
            ></div>
          </div>
          <div className="h-[1px] bg-color w-full mt-5 mb-5"></div>
        </div>

        {/* ảnh của tôi */}
        <div>
          {active == "upMenu" && (
            <div className="2xl:columns-7 xl:columns-5 lg:columns-4 md:columns-3 sm:columns-2 columns-2 gap-4 p-4 ">
              {upPins.data &&
                upPins.data.map((upPin) => {
                  return (
                    <div
                      key={upPin.id}
                      className=" mb-4 break-inside-avoid rounded-xl shadow-md overflow-hidden relative group"
                    >
                      <Link
                        to={`/pin/${upPin.id}`}
                        state={{ from: "/profile" }}
                      >
                        <div className="group-hover:flex hidden cursor-pointer absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent p-4 flex-col items-center justify-center">
                          <div className="w-full h-full flex items-end justify-start relative">
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsOpenModalPin(!isOpenModalPin);
                                setPintarget(upPin);
                              }}
                              className="absolute top-0 right-0 p-3 px-5 btn-red rounded-xl cursor-pointer text-white font-bold"
                            >
                              <p>Sửa</p>
                            </div>
                            <div>
                              <p className="text-white font-bold">
                                {upPin.title}
                              </p>
                              <p className="text-white">{upPin.description}</p>
                            </div>
                          </div>
                        </div>
                        <img src={upPin.image_url} alt={upPin.title} />
                      </Link>
                    </div>
                  );
                })}
            </div>
          )}

          {/* anhr ddax like */}
          <div>
            {active == "likeMenu" && (
              <div className="2xl:columns-7 xl:columns-5 lg:columns-4 md:columns-3 sm:columns-2 columns-2 gap-4 p-4 ">
                {likePins.data &&
                  likePins.data.map((likePin) => {
                    return (
                      <div
                        key={likePin?.pin.id}
                        className=" mb-4 break-inside-avoid rounded-xl shadow-md overflow-hidden relative group"
                      >
                        <Link
                          to={`/pin/${likePin?.pin.id}`}
                          state={{ from: "/profile" }}
                        >
                          <div className="group-hover:flex hidden cursor-pointer absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent p-5 flex-col items-start justify-end">
                            <p className="text-white font-bold">
                              {likePin?.pin.title}
                            </p>
                            <p className="text-white">
                              {likePin?.pin.description}
                            </p>
                          </div>
                          <img
                            src={likePin?.pin.image_url}
                            alt={likePin?.pin.title}
                          />
                        </Link>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
