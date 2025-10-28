import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  conversation_participantsAPI,
  createConversationAPI,
  searchUserAPI,
} from "../../services/api.services";
import { useAuthContex } from "../../context/AuthContext";
import toast from "react-hot-toast";

function SearchPartnerModal({ setIsOpenModal, isOpenModal, getConvertaion }) {
  const inputRef = useRef();
  const modalRef = useRef();
  const [listUser, setListUser] = useState([]);
  const { userID } = useAuthContex();

  const handelSearch = async (e) => {
    const keyword = inputRef.current.value;
    if (e.key === "Enter" && keyword) {
      const res = await searchUserAPI(keyword);
      setListUser(res);
    }
  };
  const handeleClick = async (item) => {
    const res = await createConversationAPI();
    const conversationID = res[0].id;
    const partnerId = item.id;
    if (conversationID && partnerId != userID && userID) {
      try {
        const res2 = await conversation_participantsAPI(
          conversationID,
          userID,
          partnerId
        );
        getConvertaion();
        setIsOpenModal(false);
      } catch (error) {
        toast.error("Đã có lỗi");
      }
    }
  };

  useEffect(() => {
    const handelClick = (e) => {
      if (!modalRef.current.contains(e.target)) {
        setIsOpenModal(false);
      }
    };
    if (isOpenModal) {
      document.addEventListener("mousedown", handelClick);
    } else {
      document.removeEventListener("mousedown", handelClick);
    }

    return () => document.removeEventListener("mousedown", handelClick);
  }, [isOpenModal]);

  return (
    isOpenModal && (
      <div className="fixed flex items-center justify-center inset-0 z-1000 backdrop-blur-sm">
        <div
          ref={modalRef}
          className="bg-white p-5 rounded-4xl shadow-2xl md:w-[60%] w-[90%]"
        >
          <div className="flex gap-3 w-full pb-4 items-center border-b-2 boder-color border-dashed">
            <Search />
            <input
              ref={inputRef}
              onKeyDown={handelSearch}
              className="w-full font-medium text-xl"
              type="text"
            />
          </div>
          <div className="pt-5">
            {listUser.length != 0 ? (
              listUser.map((item) => {
                return (
                  <div
                    onClick={() => handeleClick(item)}
                    className="mt-1 items-center flex gap-3 w-full p-2 cursor-pointer hover:bg-[#e1e1e1] rounded-2xl"
                    key={item.id}
                  >
                    <img
                      className="size-18 rounded-full"
                      src={item.avatar_url}
                      alt=""
                    />
                    <div className="h-18 flex flex-col justify-around">
                      <p className="font-bold text-xl">{item.full_name}</p>
                      <p className="font-bold text-sm text-gray-400/80">
                        Bắt đầu cuộc trò chuyện nhé{" "}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center">Chưa có nội dung</p>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default SearchPartnerModal;
