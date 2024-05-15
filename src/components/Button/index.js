import React, { useState } from "react";
import styled, { css } from "styled-components";

/* props의 size값에 따른 버튼 크기 설정(Large, Medium, Small) */
const sizeStyle = css`
  /* Large 사이즈 버튼*/
  ${(props) =>
    props.size === "Large" &&
    css`
      width: 100%;
      height: 60px;
      font-size: 16px;
    `};

  /* Medium 사이즈 버튼*/
  ${(props) =>
    props.size === "Medium" &&
    css`
      width: 104px;
      height: 32px;
      font-size: 16px;
    `};

  /* Small 사이즈 버튼*/
  ${(props) =>
    props.size === "Small" &&
    css`
      width: 76px;
      height: 22px;
      font-size: 11px;
    `};
`;

const StyledButton = styled.button`
  border-radius: 4px; // 버튼 테두리 둥글기
  border: none; // 버튼 초기 테두리 없애는 법
  cursor: pointer; // 마우스를 올려두면 손가락 모양 커서로 변경

  color: var(--white-color);
  background-color: var(--primary-color);

  ${sizeStyle}; // 여기서 sizeStyle을 사용 (sizeStyle이 위에서 정의된 후에 사용할 수 있음 -> 아래에서 정의하면 안된다는 뜻)

  /* cancel 버튼도 disabled 처리를 할 일이 있으므로 disabled의 적용 우선 순위를 높여주기 위해 cancel -> disabled 순으로 코드 순서를 변경 */
  ${(
    props, // cancel = {true}일 때 변경되는 것들 (Medium 버튼에만 사용되어서 위로 이동해야할 지 고민중)
  ) =>
    props.cancel &&
    css`
      background-color: var(--red-color);
    `};

  ${(
    props, // disabled = {true}일 때 변경되는 것들 (Large 버튼에만 사용되어서 위로 이동해야할 지 고민중)
  ) =>
    props.disabled &&
    css`
      background-color: var(--gray-color);
      cursor: not-allowed; // 클릭할 수 없다는 모양의 커서로 변경
    `};
`;

function Index(props) {
  /* 사용할 props 정리
        btnText: 버튼 안에 들어갈 text를 의미
        size: 버튼의 크기 값을 의미(Large, Medium, Small)
        disabled: 대여신청, 대여완료, 반납완료 버튼에서의 속성값
        cancel: 대여취소 버튼에서의 속성값
        */
  const { children, size, disabled, cancel, onClick } = props;

  return (
    <StyledButton
      disabled={disabled}
      size={size}
      cancel={cancel}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

/*
  컴포넌트 사용방법
  <Index disabled={true} size="Large" cancel={true}> children </Index>
  */

export default Index;
