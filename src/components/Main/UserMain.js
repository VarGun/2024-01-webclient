import styled from "styled-components";
import TitleImg from "../../assets/title.svg";
import RentalItemImg from "../../assets/defaultImage.svg";
import Button from "../Button";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import rentalAPI from "../../apis/rentalAPI";
import itemAPI from "../../apis/itemAPI";
// import defaultImage from "../assets/defaultImage.svg";

const UserMainContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 92px 56px;
  box-sizing: border-box;
  position: relative;
  border: 2px solid #e6e6e6;
  border-radius: 12px;
`;

const UserMainTitle = styled.div`
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const UserRentalList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 672px;
  overflow-y: auto;
`;

const UserRentalItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 44px 28px;
  box-sizing: border-box;
  border-bottom: 1px solid #d8d8d8;
`;

const UserRentalImg = styled.img`
  width: 120px;
  height: 120px;
`;

const UserRentalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
`;
const RentalItemName = styled.span`
  font-size: 20px;
`;

const RentalItemQuantity = styled.span`
  font-size: 12px;
  color: #9c9c9c;
`;

const UserMain = ({
  setRightSide,
  selectedItemId,
  setSelectedItemId,
  setCancleTrigger,
  cancelTrigger,
}) => {
  const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]); // 쿠키 훅
  const [itemList, setItemList] = useState([]);
  useEffect(() => {
    fetchAndUpdateItems();
  }, []);

  const updateItemListState = (allItems, userRentalList) => {
    const updatedItems = allItems.map((item) => {
      const reversedRentalList = [...userRentalList].reverse();

      const rentalInfo = reversedRentalList.find(
        (rental) => rental.item === item._id,
      );
      let state;
      let rentalId;
      if (
        !rentalInfo ||
        (rentalInfo.approved !== null && rentalInfo.returned !== null)
      ) {
        state = 0; // 대응하는 rental 정보가 없거나, approved와 returned가 모두 null이 아닌 경우
        rentalId = "";
      } else if (rentalInfo.approved === null) {
        state = 1; // 대여 승인 대기중
        rentalId = rentalInfo._id;
      } else if (rentalInfo.approved !== null && rentalInfo.returned === null) {
        state = 2; // 대여중
        rentalId = rentalInfo._id;
      }
      if (state !== 1 && item.count === 0) state = 3; // 재고 없음
      return {
        ...item,
        state: state,
        rentalId: rentalId,
      };
    });
    return updatedItems;
  };

  const fetchAndUpdateItems = async () => {
    const cookie = cookies.auth_token;
    const allItemsResponse = await itemAPI.getAllItemList();
    const allItems = allItemsResponse.data;
    const userRentalResponse = await rentalAPI.getUserRentalList(cookie);
    const userRentalList = userRentalResponse.data;
    const updatedItemList = updateItemListState(allItems, userRentalList);
    setCancleTrigger(!cancelTrigger);
    setItemList(updatedItemList);
  };

  const cancelRental = async (rentalId) => {
    const cookie = cookies.auth_token;
    const res = await rentalAPI.cancelRental(cookie, rentalId);
    if (res.status === 200) {
      Swal.fire({
        title: "신청이 취소되었습니다.",
        icon: "success",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
      fetchAndUpdateItems();
    } else {
      Swal.fire({
        title: "신청 취소에 실패하였습니다.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
    }
  };
  const handleBase64 = (byteArray) => {
    const byteCharacters = byteArray.reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    );
    const base64String = btoa(byteCharacters);
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleRentalClick = (item) => {
    if (item.state === 0) {
      // navigate("../user-rental", { state: { item: item } });
      setSelectedItemId(item._id);
      setRightSide("UserRental");
    } else if (item.state === 1) {
      Swal.fire({
        title: "신청을 취소하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--primary-color)",
        cancelButtonColor: "var(--red-color)",
        confirmButtonText: "예",
        cancelButtonText: "아니요",
      }).then((result) => {
        if (result.isConfirmed) {
          cancelRental(item.rentalId);
        } else {
          // setIsButtonDisabled(false); // 아니요 버튼을 누르면 버튼이 다시 활성화 되도록
        }
      });
    }
  };

  const stateList = ["대여하기", "신청취소", "반납하기", "재고없음"];

  const rentalClick = () => {
    setRightSide("UserRental");
  };
  const cancelClick = () => {
    Swal.fire({
      icon: "warning",
      title: "신청을 취소하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "신청이 취소되었습니다",
          showConfirmButton: true,
        });
      } else {
        return;
      }
    });
  };
  const returnClick = () => {
    Swal.fire({
      icon: "warning",
      title: "반납하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "반납이 완료되었습니다",
          showConfirmButton: true,
        });
      } else {
        return;
      }
    });
  };

  const btnClick = (state) => {
    if (state === 0) {
      rentalClick();
    } else if (state === 1) {
      cancelClick();
    } else if (state === 2) {
      returnClick();
    }
  };

  return (
    <UserMainContainer>
      <UserMainTitle>
        <img src={TitleImg} />
        물품 대여
      </UserMainTitle>
      <UserRentalList>
        {itemList.map((item, index) => (
          <UserRentalItem key={index}>
            {/*<img src={handleBase64(item.image.data)} alt={defaultImage} />*/}
            <UserRentalImg
              src={handleBase64(item.image.data)}
              alt={RentalItemImg}
            />
            <UserRentalInfo>
              <RentalItemName>{item.product_name}</RentalItemName>
              <RentalItemQuantity>남은 수량 : {item.count}</RentalItemQuantity>
            </UserRentalInfo>
            <Button
              children={stateList[item.state]}
              size="Medium"
              cancel={item.state === 1}
              disabled={item.state === 3}
              onClick={() => handleRentalClick(item)}

              // onClick={() => {
              //   if (item.state === 0) {
              // btnClick(item.state);

              // }
              // onClick={() => handleRentalClick(item)}
            />
          </UserRentalItem>
        ))}
      </UserRentalList>
    </UserMainContainer>
  );
};
export default UserMain;
