import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

interface ValuesExpanderProps {
  showValue: boolean;
  toggleShowValue: () => void;
  addVals: number;
}

class ValuesExpander extends React.Component<ValuesExpanderProps> {
  render() {
    const { toggleShowValue, showValue, addVals } = this.props;
    return (
      <b>
        {showValue && (
          <span className="shorten-crumb">
            <FontAwesome
              className="chevron-left crumb-icon"
              name="chevron-left"
              onClick={toggleShowValue}
            />
          </span>
        )}
        {!showValue && addVals > 0 && (
          <span className="crumb-container">
            {`...${addVals} others`}
            <FontAwesome
              className="chevron-right crumb-icon"
              name="chevron-right"
              onClick={toggleShowValue}
            />
          </span>
        )}
      </b>
    );
  }
}

export default ValuesExpander;
