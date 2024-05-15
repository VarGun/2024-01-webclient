import styled from "styled-components";
import Header from "../components/Header";
import Button from "../components/Button";
import StudentId from "../components/input/StudentId";
import Name from "../components/input/Name";
import Email from "../components/input/Email";
import PasswordInput from "../components/input/PasswordInput";
import PasswordInputCheck from "../components/input/PasswordInputCheck";
// import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import accountAPI from "../apis/accountAPI";

const SignUpContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const SignUpWrapper = styled.div`
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

const SignUpTitle = styled.span`
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

const SignInText = styled.p`
  font-size: 16px;
  color: #7a7a7a;
`;
const SignInLink = styled.span`
  color: var(--primary-color);
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
`;

const SignUpFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
`;

const SignUp = () => {
  const navigate = useNavigate();

  const [nameValue, setNameValue] = useState("");
  const [studentIdValue, setStudentIdValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordCheckValue, setPasswordCheckValue] = useState("");

  const errorList = [
    "이름을",
    "학번을",
    "이메일을",
    "인증번호를",
    "비밀번호를",
    "비밀번호 확인을",
  ];
  const checkEmpty = () => {
    const valueList = [
      nameValue,
      studentIdValue,
      emailValue,
      certificateNumber,
      passwordValue,
      passwordCheckValue,
    ];
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
    if (emailError) {
      Swal.fire({
        title: "이메일 인증을 완료해주세요.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
      return false;
    }
    return true;
  };

  const handleSignInClick = () => {
    // 빈 칸이 없는지 검사. 없으면 다음 형식들 검사 실행
    if (!checkEmpty()) return;
    // 이름에 숫자가 포함되어 있는지 확인
    const hasNumber = /\d/.test(nameValue);
    const hasLetterInStudentId = /[a-zA-Z]/.test(studentIdValue);

    if (hasNumber) {
      // 숫자와 문자 포함되어 있으면 알림 창 띄우기
      Swal.fire({
        title: "이름을 한글로 작성해주세요.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
    } else if (hasLetterInStudentId) {
      Swal.fire({
        title: "학번 형식이 틀렸습니다.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
    } else if (passwordValue !== passwordCheckValue) {
      // 비밀번호와 비밀번호 확인 값이 다를 때 알림창 띄우기
      Swal.fire({
        title: "비밀번호가 틀렸습니다. 다시 입력해주세요.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
    } else {
      // 숫자가 포함되어 있지 않고 비밀번호가 일치하면 회원가입 페이지로 이동
      return true;
    }
  };

  const signUp = async () => {
    if (!handleSignInClick()) return;

    const data = {
      user_number: studentIdValue,
      name: nameValue,
      email: emailValue,
      code: certificateNumber,
      password: passwordValue,
      password2: passwordCheckValue,
    };
    try {
      const res = await accountAPI.signUp(data);
      if (res.status === 201 || res.status === 200) {
        Swal.fire({
          title: "회원가입이 완료되었습니다.",
          icon: "success",
          confirmButtonColor: "var(--primary-color)",
          confirmButtonText: "확인",
        });
        navigate("/");
      } else {
        Swal.fire({
          title: "회원가입에 실패했습니다. 다시 시도해주세요.",
          icon: "error",
          confirmButtonColor: "var(--primary-color)",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "회원가입에 실패했습니다. 다시 시도해주세요.",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <SignUpContainer>
      <Header buttonText={"로그인 / 회원가입"} />
      <SignUpWrapper>
        <SignUpTitle>회원가입</SignUpTitle>
        <InputWrapper>
          <Name onChange={setNameValue} value={nameValue} />
          <StudentId onChange={setStudentIdValue} value={studentIdValue} />
          <Email
            value={emailValue}
            onChange={setEmailValue}
            certificationNumber={certificateNumber}
            setCertificationNumber={setCertificateNumber}
            emailError={emailError}
            setEmailError={setEmailError}
          />
          <PasswordInput onChange={setPasswordValue} value={passwordValue} />
          <PasswordInputCheck
            onChange={setPasswordCheckValue}
            value={passwordCheckValue}
          />
        </InputWrapper>
        <SignUpFooter>
          {/*<Button size="Large">로그인</Button>*/}
          <Button size="Large" onClick={() => signUp()}>
            회원 가입
          </Button>

          <SignInText>
            이미 회원이신가요?
            <SignInLink onClick={() => navigate("/")}>로그인</SignInLink>
          </SignInText>
        </SignUpFooter>
      </SignUpWrapper>
    </SignUpContainer>
  );
};

export default SignUp;
