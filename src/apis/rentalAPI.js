import { customAxios } from "./customAxios";

export default {
  // 전체 대여 내역 조회하기 - 관리자
  getAllRentalList(authToken) {
    try {
      return customAxios.get("rental/all", {
        headers: {
          Authorization: authToken,
        },
      });
    } catch (error) {
      console.error("전체 대여 내역 조회 중 오류 발생:", error);
      // throw error; // 에러를 다시 throw 하여 호출한 곳에서 처리할 수 있도록 함
    }
  },

  // 사용자 대여 내역 조회하기
  getUserRentalList(authToken) {
    try {
      return customAxios.get("rental", {
        headers: {
          Authorization: authToken,
        },
      });
    } catch (error) {
      console.error("사용자 대여 내역 조회 중 오류 발생:", error);
      // throw error;
    }
  },

  // 사용자 대여 신청하기
  requestRental(authToken, rentalData) {
    try {
      return customAxios.post(
        "rental",
        { item_id: rentalData.item_id, count: rentalData.count },
        { headers: { Authorization: authToken } },
      );
    } catch (error) {
      console.error("대여 신청 중 오류 발생:", error);
      // throw error;
    }
  },

  // 사용자 대여 신청 취소하기 - 사용자
  cancelRental(authToken, rentalId) {
    try {
      return customAxios.delete(`rental/${rentalId}`, {
        headers: { Authorization: authToken },
      });
    } catch (error) {
      console.error("대여 신청 취소 중 오류 발생:", error);
      // throw error;
    }
  },

  // 사용자 대여 신청 승인하기 - 관리자
  approveRental(authToken, rentalId) {
    try {
      return customAxios.post(
        `rental/approve/${rentalId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        },
      );
    } catch (error) {
      console.error("대여 신청 승인 중 오류 발생:", error);
      // throw error;
    }
  },

  // 반납 완료 처리 - 관리자
  returnRental(authToken, rentalId) {
    try {
      return customAxios.post(
        `rental/return/${rentalId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        },
      );
    } catch (error) {
      console.error("반납 처리 중 오류 발생:", error);
      // throw error;
    }
  },
};
