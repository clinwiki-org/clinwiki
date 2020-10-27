import styled from 'styled-components';
import withTheme from '../../containers/ThemeProvider';

export default withTheme(styled.div`
  .filter-values {
    background-color: transparent;
    border: none;
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
