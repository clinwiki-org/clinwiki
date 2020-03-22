import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import ValuesExpander from './ValuesExpander';
import ValueCrumb from './ValueCrumb';

interface ValuesCrumbProps {
  category?: string;
  values?: string[];
  labels?: string[];
  onClick: (s: string) => void;
}
interface ValuesCrumbState {
  showValue: boolean;
}

class ValuesCrumb extends React.Component<ValuesCrumbProps, ValuesCrumbState> {
  state = {
    showValue: false,
  };

  toggleShowValue = () => {
    const { showValue } = this.state;

    this.setState({ showValue: !showValue });
  };

  render() {
    const { category, values = [], labels, onClick } = this.props;
    const { showValue } = this.state;
    const addVals = values ? values.length - 4 : 0;
    return (
      <React.Fragment>
        {category && <i>{category}:</i>}
        {values.slice(0, showValue ? values.length : 4).map((v, i) => {
          return (
            <ValueCrumb
              key={v}
              onClick={() => onClick(v)}
              label={labels ? labels[i] : v}
            />
          );
        })}
        <ValuesExpander
          showValue={showValue}
          addVals={addVals}
          toggleShowValue={this.toggleShowValue}
        />
      </React.Fragment>
    );
  }
}

export default ValuesCrumb;
