import React, { useState } from "react";
import styled from "styled-components";
import iconpassword1 from "../../assets/iconpassword1.svg";
import iconpassword2 from "../../assets/iconpassword2.svg";
import "react-datepicker/dist/react-datepicker.css";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InputDiv = styled.input`
  font-size: 16px;
  height: 20px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #e6e6e6;
  outline: none;
  ::placeholder {
    color: var(--gray-color);
  }
`;

const InputImage = styled.img`
  position: absolute;
  top: 30%;
  right: 10px; /* 이미지의 오른쪽 여백 조절 */
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%; /* 필요에 따라 조절 */
`;

function Password({ onChange, value }) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const getPasswordIcon = () => {
    return showPassword ? iconpassword1 : iconpassword2;
  };

  return (
    <InputContainer>
      <InputWrapper>
        <InputDiv
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호"
          onChange={(e) => onChange(e.target.value)} // 입력값이 변경될 때마다 onChange prop으로 전달된 함수 호출
          value={value}
        />
        <InputImage
          src={getPasswordIcon()}
          alt="Icon"
          onClick={togglePasswordVisibility}
        />
      </InputWrapper>
    </InputContainer>
  );
}

export default Password;
