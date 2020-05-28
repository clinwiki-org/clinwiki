import * as React from 'react';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import { Well } from 'react-bootstrap';
import withTheme from '../../containers/ThemeProvider';

const LoaderWrapper = styled.div`
  margin: 50px 20px;

  text-align: center;

  .well {
    padding: 50px;
  }
`;

const ThemedLoaderWrapper = withTheme(LoaderWrapper);

export default () => (
  <ThemedLoaderWrapper>
    <Well>
      <BeatLoader color="#cccccc" />
    </Well>
  </ThemedLoaderWrapper>
);
