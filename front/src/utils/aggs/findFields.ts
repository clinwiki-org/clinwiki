import { SiteViewFragment_search_aggs_fields } from 'services/site/model/SiteViewFragment';
import { propEq, find } from 'ramda';

// aggToField
export default (agg, siteView, presearch) => {
  if (presearch === true) {
    return find(propEq('name', agg), [
      ...(siteView?.search?.presearch?.aggs?.fields || []),
      ...(siteView?.search?.presearch?.crowdAggs?.fields || []),
    ]) as SiteViewFragment_search_aggs_fields | null;
  }
  return find(propEq('name', agg), [
    ...(siteView?.search?.aggs?.fields || []),
    ...(siteView?.search?.crowdAggs?.fields || []),
  ]) as SiteViewFragment_search_aggs_fields | null;
};
