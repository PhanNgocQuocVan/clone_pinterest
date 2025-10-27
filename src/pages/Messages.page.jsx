import { useEffect, useRef, useState } from "react";
import {
  getConversationAPI,
  getMessagesAPI,
  sendAPI,
} from "../services/api.services";
import { useAuthContex } from "../context/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "./../services/supabaseClient";

function MessagesPage() {
  dayjs.extend(relativeTime);
  dayjs.locale("vi");
  const [convertaion, setConvertaion] = useState([]);
  const [messages, setMessages] = useState([]);
  const [idConvertaion, setIdConvertaion] = useState();
  const [infoPartner, setInfoPartner] = useState({});
  const [content, setContent] = useState("");
  const { userID } = useAuthContex();
  console.log(userID);

  const handelClick = (item) => {
    setInfoPartner({
      name: item.partner_full_name,
      avater: item.partner_avatar,
      id: item.partner_id,
    });
    setIdConvertaion(item.conversation_id);
  };

  const handelSend = async () => {
    if (content && userID && idConvertaion) {
      try {
        await sendAPI(idConvertaion, userID, content);
        setContent("");
      } catch (error) {
        toast.error("lỗi khi gửi tin nhắn vui lòng thử lại sau");
      }
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      if (idConvertaion) {
        const res = await getMessagesAPI(idConvertaion);
        setMessages(res);
      }
    };
    getMessages();

    if (!idConvertaion) return;

    // Đăng ký lắng nghe realtime thay đổi trong bảng messages
    const channel = supabase
      .channel("room-messages") // tên kênh tự đặt
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${idConvertaion}`,
        },
        (payload) => {
          console.log("📩 New message: ", payload.new);
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [idConvertaion]);

  useEffect(() => {
    const getConvertaion = async () => {
      const res = await getConversationAPI(userID);
      setConvertaion(res);
      const infoPartnerDefau = {
        name: res[0].partner_full_name,
        avater: res[0].partner_avatar,
        id: res[0].partner_id,
      };
      setInfoPartner(infoPartnerDefau);
      setIdConvertaion(res[0].conversation_id);
    };
    getConvertaion();
  }, []);

  return (
    <div className="pl-5 h-[calc(100vh-80px)] flex">
      <div className="w-[25%] h-full">
        {convertaion.map((item) => {
          return (
            <div
              onClick={() => handelClick(item)}
              className="w-full flex gap-3 cursor-pointer hover:bg-[#e1e1e1] p-2 rounded-2xl"
              key={item.conversation_id}
            >
              <img
                className="size-14 rounded-full"
                src={item.partner_avatar}
                alt=""
              />
              <div className="w-full flex flex-col justify-around">
                <div className="flex items-center justify-between w-full">
                  <p className="font-bold">{item.partner_full_name}</p>
                  <p className="text-sm">
                    {dayjs(item.last_time).fromNow(true)}
                  </p>
                </div>
                <p className="text-md">{item.last_message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-full w-[1px] bg-[#e5e5e5] ml-[4px]"></div>
      <div className="w-full">
        <div className=" pl-2 pb-2 border-b-1 border-[#e5e5e5] flex w-full gap-4">
          <img
            className="size-10 rounded-full"
            src={infoPartner.avater}
            alt=""
          />
          <div className="flex flex-col justify-around">
            <Link to={`/userDetail/${infoPartner.id}`} className="font-bold">
              {infoPartner.name}
            </Link>
            <div className="flex items-center">
              <div className="w-2 h-2 me-1 bg-green-500 rounded-full"></div>
              <p>online</p>
            </div>
          </div>
        </div>
        <div className="w-full h-[calc(100%-(57px))] bg-[url('https://tsjzwjgtvwccpqkptaeo.supabase.co/storage/v1/object/public/pins/1761558467955_2944bbc0830ab3d4f3b5f976e2ebe359.jpg')] overflow-auto">
          <div className="p-5 pb-18">
            {messages.map((item) => {
              if (item.sender_id === userID) {
                return (
                  <div className="w-full flex justify-end mb-5" key={item.id}>
                    <div className=" h-10 px-5 py-1 rounded-full bg-blue-600">
                      <p className="font-bold text-xl">{item.content}</p>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  className="w-full flex gap-2 items-center justify-start mb-5"
                  key={item.id}
                >
                  <img
                    className="size-10 rounded-full"
                    src={infoPartner.avater}
                    alt=""
                  />

                  <div className=" h-10 px-5 py-1 rounded-full bg-[#72726c] ">
                    <p className="font-bold text-xl">{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className=" w-full px-5 -mt-16">
          <div className="flex items-center px-5 py-1 bg-transparent border-2 border-white border-dashed backdrop-blur-md rounded-full ">
            <input
              value={content}
              className="w-full h-10 text-white font-medium"
              type="text"
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handelSend();
              }}
            />
            <Send className="cursor-pointer text-white" onClick={handelSend} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
