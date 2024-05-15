import styled from "styled-components";
import TitleImg from "../../assets/title.svg";
import RentalItemImg from "../../assets/defaultImage.svg";
import Button from "../Button";
import Count from "../input/Count";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import itemAPI from "../../apis/itemAPI";
import rentalAPI from "../../apis/rentalAPI";

const UserRentalContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 92px 56px;
  box-sizing: border-box;
  position: relative;
  border: 2px solid #e6e6e6;
  border-radius: 12px;
`;

const UserRentalTitle = styled.div`
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const UserRentalWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 28px;
  gap: 16px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const Remaining = styled.div`
  color: var(--black-color);
  font-size: 16px;
  font-weight: 500;
`;

const Text = styled.div`
  color: var(--black-color);
  font-size: 20px;
  font-weight: 700;
`;

const UserRental = ({
  setRightSide,
  selectedItemId,
  rightSide,
  setRentalList,
  setSelectedItemId,
}) => {
  const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]); // 쿠키 훅
  const [goodsImg, setGoodsImg] = useState(RentalItemImg);
  const [goodsname, setGoodsname] = useState("");
  const [count, setCount] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [item, setItem] = useState({});

  useEffect(() => {
    getItemSrc(selectedItemId);
    fetchRentalList();
  }, [rightSide]);
  const getItemName = async (itemId) => {
    const res = await itemAPI.getItem(itemId);
    return res.data.product_name;
  };

  const fetchRentalList = async () => {
    const cookie = cookies.auth_token;
    const res = await rentalAPI.getUserRentalList(cookie);
    const rentalData = res.data;

    const updatedRentalList = await Promise.all(
      rentalData.map(async (item) => {
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
          rentalState: rentalState,
          goodsName: goodsName,
        };
      }),
    );
    const sortedList = updatedRentalList.reverse();
    setRentalList(sortedList);
  };

  const handleBase64 = (byteArray) => {
    const byteCharacters = byteArray.reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    );
    const base64String = btoa(byteCharacters);
    return `data:image/jpeg;base64,${base64String}`;
  };

  const requestRental = async (count) => {
    const cookie = cookies.auth_token;
    const rentalData = {
      item_id: selectedItemId,
      count: count,
    };
    const res = await rentalAPI.requestRental(cookie, rentalData);
    if (res.status !== 200) {
      Swal.fire({
        title: "잠시 후 다시 시도해주세요.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
      // setIsButtonDisabled(false);
      return;
    } else {
      Swal.fire({
        title: "대여 신청이 완료되었습니다.",
        icon: "success",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      }).then(() => {
        setRightSide("UserMain");
        // navigate('/main');
      });
    }
  };

  const getItemSrc = async (itemId) => {
    try {
      const res = await itemAPI.getItem(itemId);
      console.log("res.data : ", res.data);
      setItem({
        image: res.data.image.data,
        product_name: res.data.product_name,
        count: res.data.count,
      });

      return res.data.image.data;
    } catch (e) {
      console.log("gmlgml");
      return "no item info";
    }
  };
  const clickRentalButton = () => {
    Swal.fire({
      title: "대여를 신청하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--primary-color)",
      cancelButtonColor: "var(--red-color)",
      confirmButtonText: "신청",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        if (count === "" || count <= 0) {
          Swal.fire({
            title: "대여 수량을 올바르게 입력해주세요.",
            icon: "error",
            confirmButtonColor: "var(--primary-color)",
            confirmButtonText: "확인",
          });
          // setIsButtonDisabled(false);
          return;
        } else if (count > item.count) {
          Swal.fire({
            title: "재고가 부족합니다.",
            icon: "error",
            confirmButtonColor: "var(--primary-color)",
            confirmButtonText: "확인",
          });
          // setIsButtonDisabled(false);
          return;
        } else {
          requestRental(count);
        }
      } else {
        // setIsButtonDisabled(false);
      }
    });
  };
  return (
    <UserRentalContainer>
      <UserRentalTitle
        onClick={() => {
          setRightSide("UserMain");
        }}
      >
        <img src={TitleImg} />
        물품 대여
      </UserRentalTitle>
      <UserRentalWrapper>
        <ImageContainer>
          <ImageBox>
            {Object.keys(item).length !== 0 ? (
              <Image src={handleBase64(item.image)} alt="Uploaded" />
            ) : (
              <Image src={RentalItemImg} />
            )}
            {/*<Image src={RentalItemImg} />*/}
          </ImageBox>
          <Text>{item.product_name}</Text>
          <Remaining>남은 수량: {item.count}</Remaining>
        </ImageContainer>
        <InfoContainer>
          <Text>대여 정보</Text>
          <Count value={count} onChange={setCount} />
        </InfoContainer>
        <Button
          onClick={() => clickRentalButton()}
          // disabled={isButtonDisabled}
          size="Large"
          cancel={false}
        >
          대여 신청
        </Button>
      </UserRentalWrapper>
    </UserRentalContainer>
  );
};
export default UserRental;
