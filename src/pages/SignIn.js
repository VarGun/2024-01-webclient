import styled from "styled-components";
import Header from "../components/Header";
import Button from "../components/Button";
import StudentId from "../components/input/StudentId";
import PasswordInput from "../components/input/PasswordInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import accountAPI from "../apis/accountAPI";

const SignInContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const SignInWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid var(--light-gray-color);
  width: 526px;
  border-radius: 12px;
  padding: 32px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
`;

const SignInTitle = styled.span`
  font-size: 32px;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const SignUpText = styled.p`
  font-size: 16px;
  color: #7a7a7a;
`;
const SignUpLink = styled.span`
  color: var(--primary-color);
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
`;

const SignInFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
`;

const SignIn = () => {
  const navigate = useNavigate();
  const [studentIdValue, setStudentIdValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [cookies, setCookies] = useCookies(["auth_token"]);
  const errorList = ["학번을", "비밀번호를"];
  const [disabled, setDisabled] = useState(false);

  const checkEmpty = () => {
    const valueList = [studentIdValue, passwordValue];
    for (let i = 0; i < valueList.length; i++) {
      if (valueList[i].trim() === "") {
        Swal.fire({
          title: `${errorList[i]} 입력해주세요.`,
          icon: "error",
          confirmButtonColor: "var(--primary-color)",
          confirmButtonText: "확인",
        });
        return false;
      }
    }
    if (studentIdValue.length !== 8 || !/^\d+$/.test(studentIdValue)) {
      Swal.fire({
        title: "학번을 올바르게 입력해주세요.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
      return false;
    }
    setDisabled(true);
    return true;
  };

  const signIn = async () => {
    if (!checkEmpty()) return;
    const data = {
      user_number: studentIdValue,
      password: passwordValue,
    };
    try {
      const res = await accountAPI.signIn(data);
      // 로그인 성공 후 받은 토큰을 쿠키에 저장
      await setCookies("auth_token", res.data.user.token);
      Swal.fire({
        title: "로그인 성공",
        icon: "success",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      }).then((res) => {
        if (res.isConfirmed) {
          setDisabled(false);
          navigate("/main");
        }
      });
    } catch (error) {
      if (error.response) {
        Swal.fire({
          // title: error.response.data,
          title: "로그인 실패",
          icon: "error",
          text: "학번 또는 비밀번호가 일치하지 않습니다.",
          confirmButtonColor: "var(--primary-color)",
          confirmButtonText: "확인",
        });
      }
      console.error("error :", error.response);
      setDisabled(false);
    }
  };

  return (
    <SignInContainer>
      <Header buttonText={"로그인 / 회원가입"} />
      <SignInWrapper>
        <SignInTitle>로그인</SignInTitle>
        <InputWrapper>
          <StudentId value={studentIdValue} onChange={setStudentIdValue} />
          <PasswordInput value={passwordValue} onChange={setPasswordValue} />
        </InputWrapper>
        {/*<Button size="Large" onClick={() => signIn()} disabled={disabled}>*/}
        <SignInFooter>
          <Button size="Large" onClick={() => signIn()}>
            로그인
          </Button>
          <SignUpText>
            회원이 아니신가요?
            <SignUpLink onClick={() => navigate("/sign-up")}>
              회원가입
            </SignUpLink>
          </SignUpText>
        </SignInFooter>
      </SignInWrapper>
    </SignInContainer>
  );
};

export default SignIn;
