import styled from "styled-components";
import TitleImg from "../../assets/title.svg";
import RentalItemImg from "../../assets/defaultImage.svg";
import Button from "../Button";
import { use, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import rentalAPI from "../../apis/rentalAPI";
import userAPI from "../../apis/userAPI";
import itemAPI from "../../apis/itemAPI";

const AdminMainContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 92px 56px;
  box-sizing: border-box;
  position: relative;
  border: 2px solid #e6e6e6;
  border-radius: 12px;
`;

const AdminMainTitle = styled.div`
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const AdminRentalList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 672px;
  overflow-y: auto;
`;

const AdminRentalItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 44px 28px;
  box-sizing: border-box;
  border-bottom: 1px solid #d8d8d8;
`;

const AdminRentalImg = styled.img`
  width: 120px;
  height: 120px;
`;

const AdminRentalInfo = styled.div`
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

const AddBtn = styled(Button)`
  position: fixed;
`;

const AdminMain = ({ setRightSide, selectedItem, setSelectedItem }) => {
  const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]); // 쿠키 훅

  const [itemList, setItemList] = useState([]);

  const getAllItemList = async () => {
    const res = await itemAPI.getAllItemList();
    setItemList(res.data);
  };
  const handleBase64 = (byteArray) => {
    const byteCharacters = byteArray.reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    );
    const base64String = btoa(byteCharacters);
    return `data:image/jpeg;base64,${base64String}`;
  };

  useEffect(() => {
    getAllItemList();
  }, []);

  const modifyClick = (item) => {
    setSelectedItem(item);
    // console.log("item : ", item);
    setRightSide("ModifyGoods");
  };

  const addClick = () => {
    setRightSide("AddGoods");
  };

  return (
    <AdminMainContainer>
      <AdminMainTitle>
        <img src={TitleImg} />
        물품 관리
      </AdminMainTitle>
      <AdminRentalList>
        {itemList.map((item, index) => (
          <AdminRentalItem key={index}>
            <AdminRentalImg
              src={handleBase64(item.image.data)}
              alt={RentalItemImg}
            />
            {/*<img src={item.image} />*/}
            <AdminRentalInfo>
              <RentalItemName>{item.product_name}</RentalItemName>
              <RentalItemQuantity>남은 수량 : {item.count}</RentalItemQuantity>
            </AdminRentalInfo>
            <Button
              children={"물품 관리"}
              size="Medium"
              onClick={() => modifyClick(item)}
            />
          </AdminRentalItem>
        ))}
      </AdminRentalList>
      <AddBtn
        onClick={() => addClick()}
        // disabled={isButtonDisabled}
        size="Large"
        cancel={false}
      >
        물품 추가
      </AddBtn>
    </AdminMainContainer>
  );
};
export default AdminMain;
