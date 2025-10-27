import axiosInstance from "./axiot.custom";

export const signupAPI = (email, password) => {
  const urlBackend = "/auth/v1/signup";
  const value = {
    email: email,
    password: password,
  };
  return axiosInstance.post(urlBackend, value);
};

export const loginAPI = (email, password) => {
  const urlBackend = "/auth/v1/token?grant_type=password";
  const value = {
    email: email,
    password: password,
  };
  return axiosInstance.post(urlBackend, value);
};

export const getInfoUserAPI = () => {
  const urlBackend = "auth/v1/user";
  return axiosInstance.get(urlBackend);
};

export const refreshTokenAPI = (refresh_token) => {
  const urlBackend = "auth/v1/token?grant_type=refresh_token";
  const value = {
    refresh_token: refresh_token,
  };
  return axiosInstance.post(urlBackend, value);
};

export const uploaImgAPI = async (path, file, fileName) => {
  const url = `storage/v1/object/${path}/${fileName}`;

  return axiosInstance.post(url, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      apikey: import.meta.env.VITE_API_KEY,
    },
  });
};

export const insertPinAPI = (pinData) => {
  const url = "/rest/v1/pins";
  return axiosInstance.post(url, pinData, {
    headers: {
      Prefer: "return=representation", // trả về row vừa insert
    },
  });
};

export const logOutAPI = () => {
  const url = "/auth/v1/logout";
  return axiosInstance.post(url);
};

export const getPinsAPI = (from, to, excludeId) => {
  let url = `/rest/v1/pins?select=*&order=created_at.desc`;

  if (excludeId) {
    url += `&id=neq.${excludeId}`;
  }

  return axiosInstance.get(url, {
    headers: {
      Range: `${from}-${to}`,
    },
  });
};

export const getPinDetailAPI = (pinId) => {
  const url = `/rest/v1/pins?id=eq.${pinId}&select=*,profile:profiles(id,full_name,avatar_url)`;
  return axiosInstance.get(url);
};

// tim
// them tim
export const addLikeAPI = (pin_id, user_id) => {
  const url = "/rest/v1/likes";
  const value = {
    pin_id: pin_id,
    user_id: user_id,
  };
  return axiosInstance.post(url, value);
};
// bo tim
export const deleteLikeAPI = (pin_id, user_id) => {
  const url = `/rest/v1/likes?pin_id=eq.${pin_id}&user_id=eq.${user_id}`;

  return axiosInstance.delete(url);
};
// dem tim
export const countLikeAPI = async (pin_id) => {
  const url = `/rest/v1/likes?pin_id=eq.${pin_id}&select=id`;

  return await axiosInstance.get(url);
};

// kiem tra tim hay chua
export const getLikedAPI = (pin_id, user_id) => {
  const url = `/rest/v1/likes?pin_id=eq.${pin_id}&user_id=eq.${user_id}`;
  return axiosInstance.get(url);
};

export const getLinkDowImgAPI = (urlPin) => {
  return axiosInstance.get(urlPin, {
    responseType: "blob", // bắt buộc để nhận blob
  });
};

export const getProfileAPI = (userId) => {
  const url = "/rest/v1/profiles";
  return axiosInstance.get(url, {
    params: {
      id: `eq.${userId}`,
      select: "*",
    },
  });
};

export const getPinsUserAPI = (userId) => {
  const url = `/rest/v1/pins?user_id=eq.${userId}&select=*,profile:profiles(id,full_name,avatar_url)&order=created_at.desc`;
  return axiosInstance.get(url);
};

export const getUserLikedPinsAPI = (userId) => {
  const url = `/rest/v1/likes?user_id=eq.${userId}&select=pin:pins(*,profile:profiles(id,full_name,avatar_url))&order=created_at.desc`;
  return axiosInstance.get(url);
};

export const updataUserProfileAPI = (userId, Name, linkAvatar) => {
  const url = `/rest/v1/profiles?id=eq.${userId}`;
  const value = {
    full_name: Name,
    avatar_url: linkAvatar,
  };
  return axiosInstance.patch(url, value, {
    headers: {
      Prefer: "return=representation",
    },
  });
};

export const updataPinAPI = (pinId, data) => {
  const url = `/rest/v1/pins?id=eq.${pinId}`;
  return axiosInstance.patch(url, data);
};

export const deletePinAPI = (pinId) => {
  const url = `/rest/v1/pins?id=eq.${pinId}`;
  return axiosInstance.delete(url);
};

export const deleteImgBucketAPI = (bucketName, nameImg) => {
  const url = `/storage/v1/object/${bucketName}/${nameImg}`;
  return axiosInstance.delete(url);
};

export const sreachAPI = (from, to, sreachValue) => {
  const url = `/rest/v1/pins?or=(title.ilike.*${sreachValue}*,description.ilike.*${sreachValue}*)`;
  return axiosInstance.get(url, {
    headers: {
      Range: `${from}-${to}`,
    },
  });
};

export const getConversationAPI = (userId) => {
  const url = "/rest/v1/chat_conversation_summary";
  return axiosInstance.get(url, {
    params: {
      viewer_id: `eq.${userId}`,
      order: "last_time.desc",
      select: `
        conversation_id,
        last_message,
        last_time,
        partner_id,
        partner_full_name,
        partner_avatar
      `,
    },
  });
};

export const getMessagesAPI = (conversationId) => {
  const url = "/rest/v1/messages";
  return axiosInstance.get(url, {
    params: {
      conversation_id: `eq.${conversationId}`,
      select: "id,content,sender_id,created_at",
      order: "created_at.asc",
    },
  });
};

export const sendAPI = (conversationId, userID, content) => {
  const url = "/rest/v1/messages";
  const value = {
    conversation_id: conversationId,
    sender_id: userID,
    content,
  };
  return axiosInstance.post(url, value);
};
