import styled from "styled-components";

const ButtonContainer = styled.div`
  display: flex;
  padding: 8px 12px;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 12px;
  color: var(--white-color);
  background-color: var(--primary-color);
  cursor: pointer;
`;

const HeaderButton = ({ text, onClick }) => {
  return <ButtonContainer onClick={() => onClick()}>{text}</ButtonContainer>;
};

export default HeaderButton;
