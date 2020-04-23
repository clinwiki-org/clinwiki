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
//animation temporarily removed from crumb-container
//animation: ${crumbKeyframe} 2s ease-in-out;
export default withTheme(styled.div`
  .filter-values {
    background-color: transparent;
    border: none;
  }
  .crumb-container {
    border: 2px solid ${props => props.theme.crumbs.crumbBackground};
    border-radius: 4px;
    padding: 0 5px 0 5px;
    margin: 1px;
    background: ${props => props.theme.crumbs.crumbBackground};
    color: ${props => props.theme.crumbs.crumbFont} !important;
    line-height: 1.85em;
  }
  .crumb-icon {
    cursor: pointer;
    color: ${props => props.theme.crumbs.crumbFont};
    margin: 0 0 0 3px;
  }
  .shorten-crumb {
    background: ${props => props.theme.crumbs.crumbBackground};
    padding: 3px 6px 3px 1px;
    border-radius: 4px;
  }
`);
