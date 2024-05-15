import styled from "styled-components";
import TitleImg from "../../assets/title.svg";
import { useEffect, useState } from "react";
import Item from "../Item";
import { useCookies } from "react-cookie";
import userAPI from "../../apis/userAPI";
import rentalAPI from "../../apis/rentalAPI";
import itemAPI from "../../apis/itemAPI";

const AdminSubContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #e6e6e6;
  border-radius: 12px;
`;

const AdminSubHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 36px 0;
  background-color: var(--primary-color);
  color: #ffffff;
  font-size: 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;
const UserName = styled.span`
  font-size: 24px !important;
`;
const AdminSubWrapper = styled.div`
  width: 100%;
  padding: 92px 56px;
  box-sizing: border-box;
  position: relative;
`;

const AdminSubTitle = styled.div`
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  gap: 20px;
  top: 20px;
  left: 20px;
`;

const AdminSubList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 508px;
  overflow-y: auto;
`;

const AdminSub = ({ setLeftSide, selectedRequest, setSelectedRequest }) => {
  const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]); // 쿠키 훅
  const [rentalList, setRentalList] = useState([]); // 대여 내역 리스트
  const [userInfo, setUserInfo] = useState({
    name: "",
    user_number: "",
    email: "",
  });

  const getUserName = async (userId) => {
    const cookie = cookies.auth_token;
    try {
      const res = await userAPI.getUserName(cookie, userId);
      const { name, user_number } = res.data;
      return user_number + " " + name;
    } catch (e) {
      return "no user name";
    }
  };
  const getItemName = async (itemId) => {
    const res = await itemAPI.getItem(itemId);
    return res.data.product_name;
  };

  const fetchRentalList = async () => {
    const cookie = cookies.auth_token;
    const res = await rentalAPI.getAllRentalList(cookie);
    const rentalData = res.data;

    const updatedRentalList = await Promise.all(
      rentalData.map(async (item) => {
        const userName = await getUserName(item.create_user);
        const goodsName = await getItemName(item.item);

        let rentalState;
        if (item.approved === null) {
          rentalState = 2;
        } else if (item.approved !== null && item.returned === null) {
          rentalState = 1;
        } else if (item.returned !== null) {
          rentalState = 3;
        }
        return {
          ...item,
          userName: userName,
          rentalState: rentalState,
          goodsName: goodsName,
        };
      }),
    );
    const sortedList = updatedRentalList.reverse();
    setRentalList(sortedList);
  };

  const getUserInfo = async () => {
    const cookie = cookies.auth_token;
    const res = await userAPI.getUserInfo(cookie);
    setUserInfo(res.data);
  };
  useEffect(() => {
    getUserInfo();
    fetchRentalList();
  }, []);

  const modifyUserNumber = (userNumber) => {
    return userNumber?.substring(2, 4) + "학번";
  };

  // // rentalState : {1: 대여중, 2: 대여신청, 3: 반납완료}
  // const [rentalList, setRentalList] = useState([
  //   {
  //     id: 1,
  //     goodsName: "물품 1",
  //     created: "2021-09-01",
  //     returned: "2021-09-02",
  //     rentalState: 1,
  //   },
  //   {
  //     id: 2,
  //     goodsName: "물품 2",
  //     created: "2021-09-02",
  //     returned: "2021-09-03",
  //     rentalState: 2,
  //   },
  //   {
  //     id: 3,
  //     goodsName: "물품 3",
  //     created: "2021-09-03",
  //     returned: "2021-09-04",
  //     rentalState: 3,
  //   },
  //   {
  //     id: 4,
  //     goodsName: "물품 4",
  //     created: "2021-09-04",
  //     returned: "2021-09-05",
  //     rentalState: 1,
  //   },
  //   {
  //     id: 5,
  //     goodsName: "물품 5",
  //     created: "2021-09-05",
  //     returned: "2021-09-06",
  //     rentalState: 1,
  //   },
  //   {
  //     id: 6,
  //     goodsName: "물품 5",
  //     created: "2021-09-05",
  //     returned: "2021-09-06",
  //     rentalState: 1,
  //   },
  // ]);

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더합니다.
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return isoString ? `${year}.${month}.${day} ${hours}:${minutes}` : "";
  }
  // const stateList = ["반납완료", "대여 중", "대여 신청"];

  const itemClick = (item) => {
    console.log("item : ", item);
    setSelectedRequest(item);
    if (item.rentalState === 1) {
      // 대여 중 클릭
      setLeftSide("ApproveReturn");
    } else if (item.rentalState === 2) {
      // 대여 신청 클릭
      setLeftSide("ApproveRental");
    }
  };

  return (
    <AdminSubContainer>
      <AdminSubHeader>
        <UserName>
          {userInfo.name}({userInfo.user_number})
        </UserName>
        <span> 소프트웨어학부 {modifyUserNumber(userInfo.user_number)}</span>
        <span>{userInfo.email}</span>
      </AdminSubHeader>
      <AdminSubWrapper>
        <AdminSubTitle>
          <img src={TitleImg} />
          대여 내역
        </AdminSubTitle>
        <AdminSubList>
          {/*{rentalList.map((item, index) => (*/}
          {/*  <AdminSubItem key={index}>*/}
          {/*    /!*<img src={handleBase64(item.image.data)} alt={defaultImage} />*!/*/}
          {/*    <img src={item.image} />*/}
          {/*    <AdminSubInfo>*/}
          {/*      <RentalItemName>{item.product_name}</RentalItemName>*/}
          {/*      <RentalItemQuantity>*/}
          {/*        남은 수량 : {item.count}*/}
          {/*      </RentalItemQuantity>*/}
          {/*    </AdminSubInfo>*/}
          {/*    <Button*/}
          {/*      children={stateList[item.state]}*/}
          {/*      size="Medium"*/}
          {/*      cancel={item.state === 1}*/}
          {/*      disabled={item.state === 2 || item.state === 3}*/}
          {/*      // onClick={() => handleRentalClick(item)}*/}
          {/*    />*/}
          {/*  </AdminSubItem>*/}
          {/*))}*/}
          {rentalList.map((item, index) => (
            <Item
              key={index}
              goodsName={item.goodsName}
              rentalDate={formatDateTime(item.created)}
              returnDate={formatDateTime(item.returned)}
              rentalState={item.rentalState}
              user={item.userName}
              // onClick={() => itemClick(item)}
              onClick={() => itemClick(item)}
            />
          ))}
        </AdminSubList>
      </AdminSubWrapper>
    </AdminSubContainer>
  );
};
export default AdminSub;
