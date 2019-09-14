import * as React from 'react';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import { Well } from 'react-bootstrap';

const LoaderWrapper = styled.div`
  margin: 50px 20px;

  text-align: center;

  .well {
    padding: 50px;
  }
`;

export default () => (
  <LoaderWrapper>
    <Well>
      <BeatLoader color="#cccccc" />
    </Well>
  </LoaderWrapper>
);
