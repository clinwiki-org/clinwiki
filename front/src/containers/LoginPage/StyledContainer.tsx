import * as React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0px none;
  background: #255685;
  margin: 40px auto;
  padding: 20px;
  max-width: 500px;
  width: 500px;
  height: 450px;
  perspective: 1000px;
  color: rgb(255, 255, 255);

  & > div {
    width: 350px;
  }
`;

export default ({ children }) => (
  <StyledWrapper>
    <h1>Clinwiki</h1>
    <div>{children}</div>
  </StyledWrapper>
);
