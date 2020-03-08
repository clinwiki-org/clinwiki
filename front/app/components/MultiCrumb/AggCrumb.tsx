import * as React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import aggToField from 'utils/aggs/aggToField';
import { AggFilterListItem, SearchParams } from 'containers/SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withSearchParams } from 'containers/SearchPage/components/SearchParamsContext';
import ValuesCrumb from './ValuesCrumb';
import ValueCrumb from './ValueCrumb';
import { update } from 'ramda';

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
        {agg.gte && (
          <ValueCrumb
            label={`Min: ${updater.getMinString()}`}
            onClick={() => updater.changeRange([null, agg.lte])}
          />
        )}
        {agg.lte && (
          <ValueCrumb
            label={`Max: ${updater.getMaxString()}`}
            onClick={() => updater.changeRange([agg.gte, null])}
          />
        )}
      </ListGroupItem>
    );
  }
}

export default withSearchParams(AggCrumb);
