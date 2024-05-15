import styled from "styled-components";
import Header from "../components/Header";

const TestWrapper = styled.div`
  width: 100%;
`;

const TestHeader = () => {
  return (
    <TestWrapper>
      <Header buttonText={"로그인 / 회원가입"} />
    </TestWrapper>
  );
};

export default TestHeader;
