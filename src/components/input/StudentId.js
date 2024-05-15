import React, { useState } from "react";
import styled from "styled-components";
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

function StudentId({ onChange, value }) {
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    onChange(newValue); // 상위 컴포넌트에 값을 전달
  };
  return (
    <InputContainer>
      <InputDiv
        type="text"
        className="input"
        placeholder="학번"
        value={value}
        onChange={handleInputChange}
      />
    </InputContainer>
  );
}

export default StudentId;
