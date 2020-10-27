import * as React from 'react';

interface ErrorProps {
  message: string;
}

class Error extends React.PureComponent<ErrorProps> {
  render() {
    return <div>{this.props.message}</div>;
  }
}

export default Error;
