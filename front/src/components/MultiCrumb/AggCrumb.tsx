import * as React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import aggToField from 'utils/aggs/aggToField';
import { AggFilterListItem, SearchParams } from 'containers/SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withSearchParams } from 'containers/SearchPage/components/SearchParamsContext';
import ValuesCrumb from './ValuesCrumb';
import ValueCrumb from './ValueCrumb';
import CrumbWrapper from './CrumbWrapper';
import { PresentSiteFragment } from 'services/site/model/PresentSiteFragment';
import findFields from 'utils/aggs/findFields';
import {  SearchParams  as SearchParamsType }  from '../../containers/SearchPage/shared';
import {getMaxString, getMinString}  from '../../containers/Islands/IslandsUtils'
interface AggCrumbProps {
  grouping: string;
  agg: AggFilterListItem;
  searchParams: SearchParams;
  updateSearchParams: (params: SearchParamsType) => Promise<void>;
  thisSiteView: PresentSiteFragment;
  removeValueFromFilter: any;
  removeFilter:any;
}

interface AggCrumbState {}

class AggCrumb extends React.Component<AggCrumbProps, AggCrumbState> {
  render() {
    const {
      agg,
      grouping,
      searchParams,
      updateSearchParams,
      thisSiteView,
    } = this.props;
    const updater = new AggFilterInputUpdater(
      agg.field,
      searchParams,
      updateSearchParams,
      grouping
    );

    let crumb = <div></div>;
    if (agg.values && agg.values.length > 0) {
      crumb = (
        <ValuesCrumb
          values={agg.values}
          onClick={(val) => this.props.removeValueFromFilter(val)}
          allowMissingFields={agg.includeMissingFields}
          removeAllowMissing={() => updater.removeAllowMissing()}
        />
      );
    } else if (agg.lte || agg.gte) {
      // console.log(agg)
      let label = `${getMinString(
        agg
      )} — ${getMaxString(agg)}`;
      if (!agg.lte) {
        label = `≥ ${getMinString(agg)}`;
      }
      if (!agg.gte) {
        label = `≤ ${getMaxString(agg)}`;
      }
      crumb = (
        <ValueCrumb label={label} onClick={(agg) => this.props.removeFilter(agg.field)} />
      );
    } else if (agg.includeMissingFields) {
      let label = "Allow Missing"
      crumb = (
        <ValueCrumb label={label} onClick={(agg) => this.props.removeFilter(agg.field)} />
      );
    } else if (agg.radius && agg.lat) {
      let label = `Within ${agg.radius} miles of current location`;
      crumb = (
        <ValueCrumb label={label} onClick={(agg) => this.props.removeFilter(agg.field)} />
      )
    } else if (agg.radius && agg.zipcode) {
      let label = `Within ${agg.radius} miles of ${agg.zipcode}`;
      crumb = (
        <ValueCrumb label={label} onClick={(agg) => this.props.removeFilter(agg.field)} />
      )
    }
    const field = findFields(agg.field, thisSiteView, false);
    const title = field?.displayName;
    return (
      <ListGroupItem className="filter-values">
        <CrumbWrapper>
          <i>
            {grouping === 'crowdAggFilters'
              ? title
              : aggToField(agg.field, title)}
            :
          </i>
          {crumb}
        </CrumbWrapper>
      </ListGroupItem>
    );
  }
}

export default withSearchParams(AggCrumb);
