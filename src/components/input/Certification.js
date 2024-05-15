import React from "react";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

function StudentId({ value, setValue }) {
  return (
    <InputContainer>
      <InputDiv
        type="text"
        placeholder="인증번호"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </InputContainer>
  );
}

export default StudentId;
