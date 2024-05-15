import React, { useState } from "react";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
// import accountAPI from "../../api/accountAPI";
import Swal from "sweetalert2";
import accountAPI from "../../apis/accountAPI";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: 100%;
`;

const InputDiv = styled.input`
  font-size: 16px;
  height: 20px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #e6e6e6;
  outline: none;
  color: black;
  ::placeholder {
    color: var(--gray-color);
  }
`;

const InputDivWithButton = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  position: relative;
  width: 100%;
`;

const ToggleButton = styled.button`
  font-size: 12px;
  position: absolute;
  height: 22px;
  right: 0;
  bottom: 4px;
  cursor: pointer;
  color: white;
  background-color: var(--primary-color);
  &:active {
    opacity: 0.3;
  }
  border-radius: 4px;
  border: none;
  &:disabled {
    background-color: #c4c4c4;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 10px;
`;

const SuccessMessage = styled.div`
  color: black;
  font-size: 10px;
`;

function Email({
  onChange,
  value,
  setCertificationNumber,
  emailError,
  setEmailError,
}) {
  const [codeSent, setCodeSent] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const emailAuth = async () => {
    if (!validateEmail()) return;
    const data = {
      email: value,
    };
    try {
      const res = await accountAPI.emailAuth(data);
      setDisabled(false);
    } catch (e) {
      Swal.fire({
        title: "인증번호 전송에 실패했습니다. 잠시 후 다시 시도해주세요..",
        icon: "error",
        confirmButtonColor: "var(--primary-color)",
        confirmButtonText: "확인",
      });
      setDisabled(false);
    }
  };
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@kookmin\.ac\.kr$/;
    const isValid = emailRegex.test(value);
    if (!isValid) {
      setEmailError(true);
      setCodeSent(false);
      return false;
    } else {
      setEmailError(false);
      setCodeSent(true);
      setDisabled(true);
      return true;
    }
  };
  return (
    <InputContainer>
      <InputWrapper>
        <InputDivWithButton>
          <InputDiv
            type="text"
            className="input"
            placeholder="학교 이메일"
            onChange={(e) => onChange(e.target.value)}
          />
          <ToggleButton onClick={() => emailAuth()} disabled={disabled}>
            인증번호 발송
          </ToggleButton>
          {/*<ToggleButton disabled={disabled}>{"인증번호 전송"}</ToggleButton>*/}
        </InputDivWithButton>
        {emailError && (
          <ErrorMessage>이메일 형식이 맞지 않습니다.</ErrorMessage>
        )}
        {codeSent && (
          <SuccessMessage>인증번호가 발송되었습니다.</SuccessMessage>
        )}
      </InputWrapper>
      <InputDiv
        type="text"
        placeholder="인증번호"
        onChange={(e) => setCertificationNumber(e.target.value)}
      />
    </InputContainer>
  );
}

export default Email;
