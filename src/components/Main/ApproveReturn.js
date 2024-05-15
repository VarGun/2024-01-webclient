import styled from "styled-components";
import TitleImg from "../../assets/title.svg";
import RentalItemImg from "../../assets/defaultImage.svg";
import Button from "../Button";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import itemAPI from "../../apis/itemAPI";
import rentalAPI from "../../apis/rentalAPI";

const ApproveReturnContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 92px 56px;
  box-sizing: border-box;
  position: relative;
  border: 2px solid #e6e6e6;
  border-radius: 12px;
`;

const ApproveReturnTitle = styled.div`
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const ApproveReturnWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-height: 80%;
  //max-height: 672px;
  overflow-y: auto;
  box-sizing: border-box;
`;
const ImageBox = styled.div`
  display: flex;
  width: 200px;
  height: 200px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: var(--light-gray-color);
  cursor: pointer;
`;
const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  gap: 20px;
  padding-bottom: 60px;
  > div {
    font-size: 20px;
    font-weight: bold;
  }
`;

const ApproveReturn = ({
  setLeftSide,
  selectedRequest,
  setSelectedRequest,
}) => {
  const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]); // 쿠키 훅

  const [goodsImg, setGoodsImg] = useState(RentalItemImg);
  const [goodsName, setGoodsName] = useState("");
  const [userName, setUserName] = useState("곽희건");
  const [created, setCreated] = useState("오전 10:00");
  const [count, setCount] = useState(0);
  const [isReturn, setIsReturn] = useState(false);

  const extractTime = (datetimeString) => {
    const date = new Date(datetimeString);

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const meridiem = hours < 12 ? "오전" : "오후";
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${meridiem} ${formattedHours}:${formattedMinutes}`;
  };

  const getItemSrc = async (itemId) => {
    try {
      const res = await itemAPI.getItem(itemId);
      return res.data.image.data;
    } catch (e) {
      return "no item info";
    }
  };
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const fetchImage = async () => {
    const itemSrc = await getItemSrc(selectedRequest.item); // itemSrc가 비동기로 가져온 데이터이므로 await을 사용합니다.
    const base64Image = arrayBufferToBase64(itemSrc); // 가져온 데이터를 Base64로 변환합니다.
    setGoodsImg(`data:image/jpeg;base64,${base64Image}`);
  };

  useEffect(() => {
    setGoodsName(selectedRequest.goodsName);
    setUserName(selectedRequest.userName);
    setCreated(extractTime(selectedRequest.created));
    setCount(selectedRequest.count);
    fetchImage();
  }, []);

  // 대여 승인 - 관리자
  const returnRental = async (rentalId) => {
    const cookie = cookies.auth_token;
    const res = await rentalAPI.returnRental(cookie, rentalId);
    if (res.status === 200) {
      Swal.fire({
        title: "반납 신청이 승인되었습니다.",
        icon: "success",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      }).then((res) => {
        if (res.isConfirmed) {
          setLeftSide("AdminSub");
        }
      });
    } else {
      Swal.fire({
        title: "반납 신청 승인에 실패하였습니다.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
    }
  };

  const clickReturnButton = () => {
    Swal.fire({
      title: "반납 신청 처리",
      icon: "warning ",
      text: "반납 신청을 처리하시겠습니까?",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        returnRental(selectedRequest._id);
      } else {
        return;
      }
    });
  };
  return (
    <ApproveReturnContainer>
      <ApproveReturnTitle
        onClick={() => {
          setLeftSide("AdminSub");
        }}
      >
        <img src={TitleImg} />
        반납 신청 처리
      </ApproveReturnTitle>
      <ApproveReturnWrapper>
        <ImageContainer>
          <ImageBox>
            {selectedRequest ? (
              <Image src={goodsImg} alt="Uploaded" />
            ) : (
              <RentalItemImg />
            )}
          </ImageBox>
        </ImageContainer>
        <ListItem>
          <div>대여 물품: {goodsName}</div>
          <div>대여자: {userName}</div>
          {/*<div>대여 시간: {extractTime(item.created)}</div>*/}
          <div>대여 시간: {created}</div>
          <div>대여 수량: {count}</div>
        </ListItem>
        <Button
          onClick={() => clickReturnButton()}
          // disabled={isButtonDisabled}
          size="Large"
          cancel={false}
        >
          반납 신청 처리
        </Button>
      </ApproveReturnWrapper>
    </ApproveReturnContainer>
  );
};
export default ApproveReturn;
