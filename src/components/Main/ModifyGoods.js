import styled from "styled-components";
import TitleImg from "../../assets/title.svg";
import RentalItemImg from "../../assets/defaultImage.svg";
import Button from "../Button";
import Count from "../input/Count";
import Name from "../input/Name";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import itemAPI from "../../apis/itemAPI";

const ModifyGoodsContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 92px 56px;
  box-sizing: border-box;
  position: relative;
  border: 2px solid #e6e6e6;
  border-radius: 12px;
`;

const ModifyGoodsTitle = styled.div`
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const ModifyGoodsWrapper = styled.div`
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
  padding-bottom: 60px;
`;

const ModifyGoods = ({
  setRightSide,
  selectedItem,
  setSelectedItem,
  setLeftSide,
}) => {
  const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]); // 쿠키 훅

  const [goodsImg, setGoodsImg] = useState(RentalItemImg);
  const [goodsName, setGoodsName] = useState("");
  const [count, setCount] = useState(0);
  const [isReturn, setIsReturn] = useState(false);
  const handleBase64 = (byteArray) => {
    const byteCharacters = byteArray.reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    );
    const base64String = btoa(byteCharacters);
    return `data:image/jpeg;base64,${base64String}`;
  };
  useEffect(() => {
    setGoodsImg(handleBase64(selectedItem.image.data));
    setGoodsName(selectedItem.product_name);
    setCount(selectedItem.count);
  }, []);

  const updateItem = async () => {
    const cookie = cookies.auth_token;

    const itemInfo = {
      product_name: goodsName,
      count: count,
    };
    const res = await itemAPI.updateItem(cookie, selectedItem._id, itemInfo);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  };

  const clickRentalButton = () => {
    if (goodsName === "" || count === 0) {
      Swal.fire({
        icon: "error",
        title: "물품 수정 실패",
        text: "물품명과 수량을 입력해주세요.",
        showConfirmButton: true,
        confirmButtonText: "확인",
      }).then((res) => {
        if (res.isConfirmed) {
          return;
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "물품 수정",
        text: "물품을 수정하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "수정",
        cancelButtonText: "취소",
      }).then((res) => {
        if (res.isConfirmed) {
          updateItem();
          Swal.fire({
            icon: "success",
            title: "물품 수정 성공",
            text: "물품이 수정되었습니다.",
            showConfirmButton: true,
            confirmButtonText: "확인",
          }).then((res) => {
            if (res.isConfirmed) {
              setRightSide("AdminMain");
            }
          });
        } else {
          return;
        }
      });
    }
  };

  return (
    <ModifyGoodsContainer>
      <ModifyGoodsTitle onClick={() => setRightSide("AdminMain")}>
        <img src={TitleImg} />
        물품 수정
      </ModifyGoodsTitle>
      <ModifyGoodsWrapper>
        <ImageContainer>
          <ImageBox>
            <Image src={goodsImg} />
          </ImageBox>
        </ImageContainer>
        <InfoContainer>
          {/*<Text>대여 정보</Text>*/}
          <Name value={goodsName} onChange={setGoodsName} />
          <Count value={count} onChange={setCount} />
        </InfoContainer>
        <Button
          onClick={() => clickRentalButton()}
          // disabled={isButtonDisabled}
          size="Large"
          cancel={false}
        >
          물품 수정
        </Button>
      </ModifyGoodsWrapper>
    </ModifyGoodsContainer>
  );
};
export default ModifyGoods;
