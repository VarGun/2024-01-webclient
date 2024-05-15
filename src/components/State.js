import styled, { css } from "styled-components";

const State = styled.div`
  width: 62px;
  height: 22px;

  border: none;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  // 공통 스타일
  color: white;
  font-size: 12px;
  cursor: pointer;

  // props에 따른 변화
  ${(props) => css`
    // 상태에 따라 색상과 문구 변경
    background-color: ${props.status === 1
      ? "var(--primary-color)"
      : props.status === 2
        ? "var(--primary-similar-color)"
        : props.status === 3
          ? "var(--light-gray-color)"
          : "blue"};
  `}
`;

export default State;
