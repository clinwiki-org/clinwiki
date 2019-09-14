import * as React from 'react';
import styled from 'styled-components';

interface ErrorProps {
  message: string;
}

class Error extends React.PureComponent<ErrorProps> {
  render() {
    return <div>{this.props.message}</div>;
  }
}

export default Error;
