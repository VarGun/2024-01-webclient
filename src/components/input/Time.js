import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Clock from "../../assets/clock.svg";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%; /* 필요에 따라 조절 */
  margin-bottom: 40px;
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  border: none;
  border-bottom: 1px solid #e6e6e6;
  outline: none;
  font-size: 16px;
  height: 20px;
  width: 100%;
`;
const TimeIcon = styled.img`
  position: absolute;
  right: 0;
  top: 0;
`;
function Time({ onChange, value }) {
  // 부모 컴포넌트로부터 전달받은 value를 useState의 초기값으로 설정
  const [startTime, setStartTime] = useState(value);

  const onSelect = (time) => {
    setStartTime(time); // 시간 상태 업데이트
    onChange(time); // 부모 컴포넌트에 변경 사항 전달
  };

  return (
    <InputContainer>
      <InputWrapper>
        <StyledDatePicker
          selected={startTime}
          onChange={(time) => onSelect(time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="대여시간"
          dateFormat="aa h:mm"
          placeholderText="대여시간"
        />
        <TimeIcon src={Clock} />
      </InputWrapper>
    </InputContainer>
  );
}

export default Time;
