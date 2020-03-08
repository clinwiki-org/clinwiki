import * as React from 'react';
import styled from 'styled-components';

export const CrumbWrapper = styled.div`
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
`;
