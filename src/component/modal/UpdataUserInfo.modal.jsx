import { ImageUp, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import avatarDefaul from "../../accset/logo/avatar-defaul.png";
import { updataUserProfileAPI, uploaImgAPI } from "../../services/api.services";
import toast from "react-hot-toast";

function UpdataUserInfoModal({
  isOpenModalUser,
  setIsOpenModalUser,
  dataProfile,
}) {
  const nameRef = useRef();
  const [urlImgDemo, setUrlImgDemo] = useState();
  const [fileAvatar, setFileAvatar] = useState();
  const [loading, setLoading] = useState(false);

  const handelUpdataUser = async () => {
    const safeName = fileAvatar?.name
      ? fileAvatar.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
      : "image.jpg";
    const fileName = `${Date.now()}-${safeName}`;

    if (loading) {
      toast.loading("Đang cập nhật...");
    }

    try {
      setLoading(true);
      const res = await uploaImgAPI("pins", fileAvatar, fileName);
      const key = res.Key;
      const urlAvatar = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/${key}`;

      try {
        const res = await updataUserProfileAPI(
          dataProfile.id,
          nameRef.current.value,
          urlAvatar
        );
        if (res) {
          toast.success("Cập nhật thành công ✅");
          setIsOpenModalUser(false);
        }
      } catch (error) {
        toast.error("Cập nhật thất bại ❌");
      }
    } catch (error) {
      toast.error("Cập nhật thất bại ❌");
    }
  };

  const showImgDemo = (e) => {
    const file = e.target.files[0];
    setFileAvatar(file);
    const url = URL.createObjectURL(file);
    setUrlImgDemo(url);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (isOpenModalUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur-[10px] z-1000 flex items-center justify-center">
      <div className=" rounded-2xl bg-white w-[480px]">
        <div className="h-[80px] w-full flex items-center justify-between px-5">
          <div
            onClick={() => setIsOpenModalUser(!isOpenModalUser)}
            className="size-4 rounded-full bg-red-600 cursor-pointer group flex items-center justify-center"
          >
            <X className="group-hover:block hidden size-[14px] font-bold" />
          </div>
          <div
            onClick={handelUpdataUser}
            className="p-3 px-5 btn-red rounded-2xl cursor-pointer text-white font-bold"
          >
            <p>lưu</p>
          </div>
        </div>
        <div className="bg-color h-[1px] w-full"></div>
        <div>
          <div className="w-full p-5 ">
            <label htmlFor="upImg" className="cursor-pointer">
              <p className="font-bold">Avatar</p>

              <img
                src={
                  urlImgDemo
                    ? urlImgDemo
                    : dataProfile?.avatar_url
                    ? dataProfile.avatar_url
                    : avatarDefaul
                }
                alt=""
                className="m-auto object-cover size-[268px] rounded-full border-dashed border-4 boder-color cursor-pointer"
              />
            </label>
            <input
              onChange={showImgDemo}
              accept="image/*"
              className="hidden"
              id="upImg"
              type="file"
            />
          </div>
          <div className=" w-full flex flex-col gap-3 p-5">
            <label className="font-bold" htmlFor="tieuDe">
              Tên
            </label>
            <input
              ref={nameRef}
              className="w-full bg-color px-5 rounded-2xl h-[70px] font-bold text-gray-800"
              type="text"
              id="tieuDe"
              defaultValue={dataProfile.full_name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdataUserInfoModal;
