// yarn add recoil로 recoil 설치 후 사용 가능
import { atom } from "recoil";

export const selectedButtonState = atom({
  key: "selectedButtonState",
  default: null,
});

export const isAdminState = atom({
  key: "isAdminState",
  default: false, // default 값은 사용자로
  // default: true, // default 값은 사용자로
});

export const isAlarmOnState = atom({
  key: "isAlarmOnState",
  default: true,
});
