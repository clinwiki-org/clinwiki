import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import withTheme from '../../containers/ThemeProvider';

const crumbKeyframe = keyframes`
  0% {
    border-color: 4px solid silver;
    background-color: #66dda9; 
  }

  50% {
    border-color: 2px solid silver;
    background-color: #5fce9d;
  }

  100% {
    border: 2px solid #55b88d;
    background-color: #55b88d;
  }
`;

export default withTheme(styled.div`
  .filter-values {
    background-color: transparent;
    border: none;
  }
  .crumb-container {
    border: 2px solid #55b88d;
    border-radius: 4px;
    padding: 0 5px 0 5px;
    color: #55b88d;
    margin: 1px;
    background: #55b88d;
    color: #fff !important;
    line-height: 1.85em;
    animation: ${crumbKeyframe} 2s ease-in-out;
  }
  .crumb-icon {
    cursor: pointer;
    color: #fff;
    margin: 0 0 0 3px;
  }
  .shorten-crumb {
    background: #55b88d;
    padding: 3px 6px 3px 1px;
    border-radius: 4px;
  }
`);
