import * as React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { AggFilterListItem } from 'containers/SearchPage/Types';
import ValuesCrumb from './ValuesCrumb';
import AggCrumb from './AggCrumb';
import CrumbWrapper from './CrumbWrapper';

interface MultiCrumbProps {
  category?: string;
  values?: string[];
  agg?: AggFilterListItem;
  labels?: string[];
  onClick: (s: string) => void;
}

class MultiCrumb extends React.Component<MultiCrumbProps> {
  render() {
    console.log('mc props', this.props);
    const { category, values, agg, onClick, labels } = this.props;

    if (agg) {
      return <AggCrumb agg={agg} onClick={onClick} />;
    }
    return (
      <ListGroupItem className="filter-values">
        <CrumbWrapper>
          <ValuesCrumb
            category={category}
            values={values}
            onClick={onClick}
            labels={labels}
          />
        </CrumbWrapper>
      </ListGroupItem>
    );
  }
}

export default MultiCrumb;
