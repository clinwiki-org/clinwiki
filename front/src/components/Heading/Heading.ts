import styled from 'styled-components';
import { Row } from 'react-bootstrap';
import heading from 'images/heading.png';

const Heading = styled(Row)`
  height: 100px;
  background: url(${heading}) center center no-repeat scroll;
  background-size: 400px 120px;
  padding: 120px;
`;

export default Heading;
