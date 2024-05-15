// Name.js
import React, { useState } from "react";
import styled from "styled-components";
import iconX from "../../assets/IconX.svg";

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
  right: 10px;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%; /* 필요에 따라 조절 */
`;

function Name({ onChange, value }) {
  // 이름 지우기
  const handleClear = () => {
    onChange("");
  };
  // 이름 최신화 시켜서 sign-up으로 넘겨주기
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    onChange(newValue); // 상위 컴포넌트에 값을 전달
  };

  return (
    <InputContainer>
      <InputWrapper>
        <InputImage src={iconX} alt="Icon" onClick={() => handleClear()} />
        <InputDiv
          type="text"
          className="input"
          placeholder="이름"
          value={value}
          onChange={handleInputChange} // 입력값이 변경될 때 호출되는 함수
        />
      </InputWrapper>
    </InputContainer>
  );
}

export default Name;
