import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';

export const StyledContainer = styled.div`
  padding: 20px;
  h3,
  h4,
  h5 {
    color: white;
  }

  .panel-group .panel{
    margin-bottom: 0;
    border-radius: 4px;
    background: bottom;
  }
`;
export const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

export const StyledLabel = styled.label`
  color: white;
`;
