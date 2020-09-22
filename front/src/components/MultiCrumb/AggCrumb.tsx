import * as React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import aggToField from 'utils/aggs/aggToField';
import { AggFilterListItem, SearchParams } from 'containers/SearchPage/Types';
import AggFilterInputUpdater from 'containers/SearchPage/components/AggFilterInputUpdater';
import { withSearchParams } from 'containers/SearchPage/components/SearchParamsContext';
import ValuesCrumb from './ValuesCrumb';
import ValueCrumb from './ValueCrumb';
import CrumbWrapper from './CrumbWrapper';
import { PresentSiteFragment } from 'types/PresentSiteFragment';
import findFields from 'utils/aggs/findFields';

interface AggCrumbProps {
  grouping: string;
  agg: AggFilterListItem;
  searchParams: SearchParams | any;
  updateSearchParams: any;
  thisSiteView: PresentSiteFragment;
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
          onClick={val => updater.removeFilter(val)}
          allowMissingFields={agg.includeMissingFields}
          removeAllowMissing={() => updater.removeAllowMissing()}
        />
      );
    } else if (agg.lte || agg.gte) {
      let label = `${updater.getMinString(
        thisSiteView
      )} — ${updater.getMaxString(thisSiteView)}`;
      if (!agg.lte) {
        label = `≥ ${updater.getMinString(thisSiteView)}`;
      }
      if (!agg.gte) {
        label = `≤ ${updater.getMaxString(thisSiteView)}`;
      }
      crumb = (
        <ValueCrumb label={label} onClick={() => updater.removeRange()} />
      );
    }else if(agg.includeMissingFields){
       let label= "Allow Missing"
       crumb = (
        <ValueCrumb label={label} onClick={() => updater.removeAllowMissing()} />
      );
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
