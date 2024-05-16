import styled from "styled-components";
import Header from "../components/Header";
import UserMain from "../components/Main/UserMain";
import AdminMain from "../components/Main/AdminMain";
import UserSub from "../components/Main/UserSub";
import UserRental from "../components/Main/UserRental";
import AddGoods from "../components/Main/AddGoods";
import ApproveRental from "../components/Main/ApproveRental";
import ApproveReturn from "../components/Main/ApproveReturn";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isAdminState } from "../recoil/recoil";
import ModifyGoods from "../components/Main/ModifyGoods";
import AdminSub from "../components/Main/AdminSub";
import rentalAPI from "../apis/rentalAPI";
import itemAPI from "../apis/itemAPI";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10%;
`;
const MainPageWrapper = styled.div`
  display: flex;
  width: 80%;
  height: 80%;
  gap: 100px;
  margin-top: 65px;
`;

const SideWrapper = styled.div`
  width: 50%;
  height: 100%;
`;

const MainPage = () => {
  // const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]); // 쿠키 훅
  // const navigate = useNavigate(); // 대여중 및 대여신청 버튼 클릭시 이동하기 위함

  const [rightSide, setRightSide] = useState("UserMain");
  const [cancelTrigger, setCancleTrigger] = useState(false);
  /* rightSide  */
  // UserRental : 사용자 - 대여 신청, UserMain : 사용지 - 대여 내역
  // AdminMain : 관리자 - 물품 관리, AddGoods : 관리자 - 물품 추가, ModifyGoods : 관리자 - 물품 수정
  const [leftSide, setLeftSide] = useState("UserSub");
  /* leftSide */
  // UserSub : 사용자 - 대여 내역, AdminSub : 관리자 - 대여 내역
  // ApproveRental : 관리자 - 대여 승인, ApproveReturn : 관리자 - 반납 승인
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState); // 관리자(true), 사용자(false)
  const [rentalList, setRentalList] = useState([]);

  // 기록할 정보 - 사용자
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [selectedItem, setSelectedItem] = useState({}); // 관리(수정) 처리하려는 아이템 - 물품
  const [selectedRequest, setSelectedRequest] = useState({}); // 대여, 반납 신청 처리하려는 아이템 - 요청

  useEffect(() => {
    console.log("MainPage rentalList : ", rentalList);
  }, [rentalList]);

  return (
    <MainPageContainer>
      <Header
        buttonText={"로그아웃"}
        rightSide={rightSide}
        setRightSide={setRightSide}
        setLeftSide={setLeftSide}
      />
      <MainPageWrapper>
        <SideWrapper>
          {!isAdmin ? (
            <>
              {rightSide === "UserMain" && (
                <UserMain
                  rightSide={rightSide}
                  setRightSide={setRightSide}
                  selectedItemId={selectedItemId}
                  setRentalList={setRentalList}
                  setSelectedItemId={setSelectedItemId}
                  cancelTrigger={cancelTrigger}
                  setCancleTrigger={setCancleTrigger}
                />
              )}
              {rightSide === "UserRental" && (
                <UserRental
                  rightSide={rightSide}
                  setRightSide={setRightSide}
                  selectedItemId={selectedItemId}
                  setSelectedItemId={setSelectedItemId}
                  setRentalList={setRentalList}
                />
              )}
            </>
          ) : (
            <>
              {rightSide === "AdminMain" && (
                <AdminMain
                  setRightSide={setRightSide}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              )}
              {rightSide === "ModifyGoods" && (
                <ModifyGoods
                  setRightSide={setRightSide}
                  setLeftSide={setLeftSide}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              )}
              {rightSide === "AddGoods" && (
                <AddGoods
                  setRightSide={setRightSide}
                  setLeftSide={setLeftSide}
                />
              )}
            </>
          )}
        </SideWrapper>
        <SideWrapper>
          {!isAdmin ? (
            <>
              {leftSide === "UserSub" && (
                <UserSub
                  rentalList={rentalList}
                  setRentalList={setRentalList}
                  rightSide={rightSide}
                  cancelTrigger={cancelTrigger}
                />
              )}
            </>
          ) : (
            <>
              {leftSide === "AdminSub" && (
                <AdminSub
                  setLeftSide={setLeftSide}
                  selectedRequest={selectedRequest}
                  setSelectedRequest={setSelectedRequest}
                />
              )}
              {leftSide === "ApproveRental" && (
                <ApproveRental
                  setLeftSide={setLeftSide}
                  selectedRequest={selectedRequest}
                  setSelectedRequest={setSelectedRequest}
                />
              )}
              {leftSide === "ApproveReturn" && (
                <ApproveReturn
                  setLeftSide={setLeftSide}
                  selectedRequest={selectedRequest}
                  setSelectedRequest={setSelectedRequest}
                />
              )}
            </>
          )}
        </SideWrapper>
      </MainPageWrapper>
    </MainPageContainer>
  );
};

export default MainPage;
