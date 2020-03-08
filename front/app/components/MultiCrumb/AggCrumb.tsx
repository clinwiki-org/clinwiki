import * as React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import aggToField from 'utils/aggs/aggToField';
import { AggFilterListItem, SearchParams } from 'containers/SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withSearchParams } from 'containers/SearchPage/components/SearchParamsContext';
import ValuesCrumb from './ValuesCrumb';
import ValueCrumb from './ValueCrumb';

interface AggCrumbProps {
  grouping: string;
  agg: AggFilterListItem;
  searchParams: SearchParams | any;
  updateSearchParams: any;
}

interface AggCrumbState {}

class AggCrumb extends React.Component<AggCrumbProps, AggCrumbState> {
  render() {
    const { agg, grouping, searchParams, updateSearchParams } = this.props;
    const updater = new AggFilterInputUpdater(
      agg.field,
      searchParams,
      updateSearchParams,
      grouping
    );

    return (
      <ListGroupItem className="filter-values">
        <i>{aggToField(agg.field)}:</i>
        {agg.values && (
          <ValuesCrumb
            values={agg.values}
            onClick={val => updater.removeFilter(val)}
          />
        )}
        {agg.gte && <ValueCrumb label={`Min: ${agg.gte}`} onClick={() => {}} />}
        {agg.lte && <ValueCrumb label={`Min: ${agg.lte}`} onClick={() => {}} />}
      </ListGroupItem>
    );
  }
}

export default withSearchParams(AggCrumb);
