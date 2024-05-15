// notificationAPI.js

import { customAxios } from "./customAxios";

export default {
  // 사용자 알림 조회하기 - 알림 여부 조회
  getNotification(authToken) {
    return customAxios.get("user/notification", {
      headers: {
        Authorization: authToken,
      },
    });
  },

  // 사용자 알림 설정하기 - 알림 설정
  setNotification(authToken, notification) {
    return customAxios.post(
      "user/notification",
      { notification: notification },
      {
        headers: {
          Authorization: authToken,
        },
      },
    );
  },
};
