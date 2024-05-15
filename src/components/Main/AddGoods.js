import styled from "styled-components";
import TitleImg from "../../assets/title.svg";
import RentalItemImg from "../../assets/defaultImage.svg";
import Button from "../Button";
import Count from "../input/Count";
import Name from "../input/Name";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import itemAPI from "../../apis/itemAPI";

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
const Input = styled.input`
  display: none; // 화면에 안보이게 하기 위함
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 28px;
  gap: 16px;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ReturnContainer = styled.div`
  display: flex;
  align-items: center;
  color: var(--black-color);
  font-size: 16px;
  font-weight: 600;
  padding-top: 32px;
  padding-bottom: 60px;
  gap: 16px;
`;
const CheckBox = styled.input`
  width: 16px;
  height: 16px;
`;

const AddGoods = ({ setRightSide }) => {
  const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]);
  const [goodsImg, setGoodsImg] = useState(RentalItemImg);
  const [goodsName, setGoodsName] = useState("");
  const [count, setCount] = useState(0);
  const [isReturn, setIsReturn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const imageInputRef = useRef(null);

  // 이미지를 업로드 할 때 호출되는 함수
  const imageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  // <ImageBox> 컴포넌트 클릭하면 호출되는 함수
  const clickImageWrapper = () => {
    imageInputRef.current.click();
  };

  const returnCheckboxChange = (e) => {
    setIsReturn(e.target.checked);
  };

  const createItem = async () => {
    const cookie = cookies.auth_token;
    const formData = new FormData();
    formData.append("product_name", goodsName);
    formData.append("type", isReturn ? "rental" : "expandable");
    formData.append("count", count);
    if (imageInputRef.current && imageInputRef.current.files[0]) {
      formData.append("item_image", imageInputRef.current.files[0]);
    }
    try {
      const res = await itemAPI.createItem(cookie, formData);
      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          title: "물품이 등록되었습니다.",
          icon: "success",
          confirmButtonColor: "var(--primary-color)",
          confirmButtonText: "확인",
        }).then((res) => {
          if (res.isConfirmed) {
            setRightSide("AdminMain");
          }
        });
      } else {
        throw new Error(`등록 실패: ${res.status}`);
      }
    } catch (error) {
      console.error("Error creating item:", error);
      Swal.fire({
        title: "물품 등록에 실패하였습니다.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
    }
  };

  const addClick = () => {
    if (!uploadedImage || !goodsName || !count) {
      Swal.fire({
        icon: "error",
        title: "물품의 정보를 모두 입력해주세요.",
        showConfirmButton: true,
        confirmButtonText: "확인",
      }).then((res) => {
        if (res.isConfirmed) {
          return;
        }
      });
    } else {
      Swal.fire({
        icon: "",
        title: "물품을 등록하시겠습니까 ?.",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      }).then((res) => {
        if (res.isConfirmed) {
          createItem();
        } else {
          return;
        }
      });
    }
  };

  // const on

  return (
    <UserRentalContainer>
      <UserRentalTitle onClick={() => setRightSide("AdminMain")}>
        <img src={TitleImg} />
        물품 등록
      </UserRentalTitle>
      <UserRentalWrapper>
        <ImageContainer>
          <ImageBox onClick={clickImageWrapper}>
            {uploadedImage ? (
              <Image src={uploadedImage} alt="Uploaded" />
            ) : (
              <Image src={RentalItemImg} />
            )}
            {/*<Image src={RentalItemImg} />*/}
          </ImageBox>
        </ImageContainer>
        <InfoContainer>
          {/*<Text>대여 정보</Text>*/}
          <Name value={goodsName} onChange={setGoodsName} />
          <Count value={count} onChange={setCount} />
        </InfoContainer>
        <ReturnContainer>
          <CheckBox
            id={"returnCheck"}
            type={"checkbox"}
            checked={isReturn}
            onChange={returnCheckboxChange}
          />
          <label htmlFor={"returnCheck"}>반납이 필요한 물품입니다.</label>
        </ReturnContainer>
        <Button
          onClick={() => addClick()}
          // disabled={isButtonDisabled}
          size="Large"
          cancel={false}
        >
          물품 등록
        </Button>
        <Input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={imageUpload}
        />
      </UserRentalWrapper>
    </UserRentalContainer>
  );
};
export default AddGoods;
