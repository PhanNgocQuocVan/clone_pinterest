import { ImageUp, Trash2, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  deleteImgBucketAPI,
  deletePinAPI,
  updataPinAPI,
  updataUserProfileAPI,
  uploaImgAPI,
} from "../../services/api.services";
import toast from "react-hot-toast";

function UpdataPinInfoModal({ isOpenModalPin, setIsOpenModalPin, pinTarget }) {
  const descriptionRef = useRef();
  const titleRef = useRef();
  const outSideRef = useRef();
  console.log(pinTarget);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpenModalPin(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handelClickUpdata = async () => {
    const description = descriptionRef.current.value;
    const titl = titleRef.current.value;
    const data = {
      title: titl,
      description: description,
    };
    const pinID = pinTarget.id;
    if (pinID && data) {
      try {
        await updataPinAPI(pinID, data);
        toast.success("Lưu thành công ✅");
      } catch (error) {
        console.log(error);
        toast.error("Lưu thất bại");
      }
    }
  };

  const handleDelete = async () => {
    if (pinTarget.id) {
      try {
        await deletePinAPI(pinTarget.id);

        const nameImg = parseSupabaseUrl(pinTarget.image_url);

        if (nameImg) {
          try {
            const res = await deleteImgBucketAPI("pins", nameImg);
            if (res) {
              toast.success("Đã xóa ảnh");
            }
          } catch (error) {
            console.log(error);
            toast.error("Đã có lỗi");
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Đã có lỗi");
      }
    }
  };

  const parseSupabaseUrl = (url) => {
    const path = new URL(url).pathname;
    const parts = path.split("/");
    const nameImg = parts.slice(6).join("/");
    return nameImg;
  };

  const clickOutSide = (e) => {
    if (e.target == outSideRef.current) {
      setIsOpenModalPin(false);
    }
  };

  return (
    <div
      ref={outSideRef}
      onClick={clickOutSide}
      className="fixed inset-0 bg-gray-400/30 backdrop-blur-[10px] z-1000 flex items-center justify-center"
    >
      <div className="w-[80%] bg-white rounded-2xl sm:max-h-max max-h-[95vh] overflow-auto">
        <div className="h-[80px] w-full flex items-center justify-between px-5">
          <div
            onClick={() => setIsOpenModalPin(!isOpenModalPin)}
            className="size-4 rounded-full bg-red-600 cursor-pointer group flex items-center justify-center"
          >
            <X className="group-hover:block hidden size-[14px] font-bold" />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <div
              onClick={handleDelete}
              className="p-3 px-5 bg-color rounded-2xl cursor-pointer"
            >
              <Trash2 />
            </div>
            <div
              onClick={handelClickUpdata}
              className="p-3 px-5 btn-red rounded-2xl cursor-pointer text-white font-bold"
            >
              <p>lưu</p>
            </div>
          </div>
        </div>
        <div className="bg-color h-[1px] w-full"></div>
        <div className="flex lg:flex-row flex-col p-10 gap-20">
          <div className=" flex items-center justify-center">
            <div className="flex flex-col gap-3">
              <p className="font-bold">Ảnh</p>
              <img
                className="object-contain max-h-[70vh]  rounded-2xl border-dashed border-4 boder-color"
                src={pinTarget.image_url}
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-1 gap-5 flex-col">
            <div className="w-full flex flex-col gap-3">
              <label className="font-bold" htmlFor="TieuDe">
                Tiêu đề
              </label>
              <input
                ref={titleRef}
                className="w-full bg-color px-5 rounded-2xl h-[60px] font-bold text-gray-800"
                type="text"
                defaultValue={pinTarget.title}
                id="TieuDe"
              />
            </div>
            <div className="w-full flex flex-col gap-3 h-full">
              <label className="font-bold" htmlFor="Mota">
                Mô tả
              </label>
              <textarea
                ref={descriptionRef}
                className="w-full bg-color px-5 py-3 rounded-2xl h-full outline-none resize-none"
                id="Mota"
                defaultValue={[pinTarget.description]}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdataPinInfoModal;
