import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

interface ValueCrumbProps {
  label: any;
  onClick: (any) => void;
}

interface ValueCrumbState {}

class ValueCrumb extends React.Component<ValueCrumbProps, ValueCrumbState> {
  render() {
    const { label, onClick } = this.props;
    return (
      <b>
        <span className="crumb-container">
          {label}
          <FontAwesome
            className="remove crumb-icon"
            name="remove"
            onClick={onClick}
          />
        </span>
      </b>
    );
  }
}

export default ValueCrumb;
