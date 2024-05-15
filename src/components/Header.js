import styled from "styled-components";
import { ReactComponent as BackIcon } from "../assets/logo-green.svg";
import { ReactComponent as SettingIcon } from "../assets/setting.svg";
import { isAdminState } from "../recoil/recoil";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import HeaderButton from "./Button/HeaderButton";
import { useCookies } from "react-cookie";
import { useState } from "react";
import Swal from "sweetalert2";
import accountAPI from "../apis/accountAPI";
import userAPI from "../apis/userAPI";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 6px 24px 6px 32px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--white-color);
  z-index: 100;
`;

const LogoImg = styled(BackIcon)``;

const LeftWrapper = styled.div`
  display: flex;
  gap: 52px;
  justify-content: space-between;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ToggleText = styled.span`
  font-size: 16px;
  color: var(--black-color);
`;
const RadioToggle = styled.div`
  display: flex;
  position: relative;
  width: 40px;
  height: 20px;
  border-radius: 50px;
  background-color: ${(props) =>
    props.isAdmin ? "var(--primary-color)" : "var(--gray-color)"};
`;

const RadioCircle = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  transition: 0.3s;
  transform: ${(props) =>
    props.isAdmin ? "translateX(20px)" : "translateX(0)"};
`;

const Header = ({ buttonText, rightSide, setRightSide, setLeftSide }) => {
  const navigate = useNavigate(); // 대여중 및 대여신청 버튼 클릭시 이동하기 위함
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState); // 관리자(true), 사용자(false)
  const [cookies, setCookies, removeCookie] = useCookies(["auth_token"]); // 쿠키 훅

  // const backClick = () => {
  //   navigate(-1);
  // };
  const clickHeaderBtn = async () => {
    // console.log("buttonText : ", buttonText);
    if (buttonText === "로그아웃") {
      await logout();
    } else {
      navigate("/");
    }
  };
  const logout = async () => {
    Swal.fire({
      title: "로그아웃 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--primary-color)",
      cancelButtonColor: "var(--red-color)",
      confirmButtonText: "로그아웃",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await accountAPI.logout(cookies.auth_token);
          if (res.status === 200) {
            Swal.fire({
              title: "로그아웃 되었습니다.",
              icon: "success",
              confirmButtonColor: "var(--primary-color)",
              confirmButtonText: "확인",
            }).then((res) => {
              if (res.isConfirmed) {
                setIsAdmin(false);
                removeCookie("auth_token");
                navigate("/"); // 로그인 페이지로 리다이렉션
              }
            });
          } else {
            // 서버에서 로그아웃 처리 실패
            throw new Error("로그아웃 처리 실패");
          }
        } catch (e) {
          Swal.fire({
            title: "로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.",
            icon: "error",
            confirmButtonColor: "var(--primary-color)",
            confirmButtonText: "확인",
          });
        }
      }
    });
  };
  const changeAdminMode = async () => {
    const cookie = cookies.auth_token;
    if (!isAdmin) {
      try {
        const res = await userAPI.getUserInfo(cookie);
        if (res.data.is_manager === false) {
          Swal.fire({
            title: "관리자로 인증된 사용자가 아닙니다.",
            icon: "error",
            confirmButtonColor: "var(--primary-color)",
            confirmButtonText: "확인",
          });
          return;
        } else {
          Swal.fire({
            title: "관리자 화면으로 이동합니다.",
            icon: "success",
            confirmButtonColor: "var(--primary-color)",
            confirmButtonText: "확인",
          });
          setRightSide("AdminMain");
          setLeftSide("AdminSub");
        }
        setIsAdmin(res.data.is_manager);
      } catch (e) {
        Swal.fire({
          title: "잠시 후 다시 시도해주세요.",
          icon: "error",
          confirmButtonColor: "var(--primary-color)",
          confirmButtonText: "확인",
        });
      }
    } else {
      setIsAdmin(false);
      setRightSide("UserMain");
      setLeftSide("UserSub");
    }
  };

  return (
    <HeaderContainer>
      <LogoImg />
      <LeftWrapper>
        <ToggleWrapper>
          <ToggleText>관리자 모드</ToggleText>
          <RadioToggle
            isAdmin={isAdmin}
            onClick={() => {
              changeAdminMode();
            }}
          >
            <RadioCircle isAdmin={isAdmin} />
          </RadioToggle>
        </ToggleWrapper>
        <HeaderButton text={buttonText} onClick={clickHeaderBtn}></HeaderButton>
      </LeftWrapper>
      {/*<SettingButton onClick={() => clickSetting()} />*/}
    </HeaderContainer>
  );
};

export default Header;
