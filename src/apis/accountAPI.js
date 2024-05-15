// accountAPI.js

import { customAxios } from "./customAxios";

export default {
  // 이메일 인증
  emailAuth(data) {
    return customAxios.post("email_auth", data);
  },

  // 회원가입
  signUp(data) {
    return customAxios.post("join", data);
  },

  // 로그인
  signIn(data) {
    return customAxios.post("login", data);
  },

  // 로그아웃
  logout(authToken) {
    return customAxios.get("logout", {
      headers: {
        Authorization: authToken,
      },
    });
  },
};
