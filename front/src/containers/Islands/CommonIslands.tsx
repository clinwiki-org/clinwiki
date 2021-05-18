import React from 'react';
import { IslandConstructor } from 'components/MailMerge/MailMergeView';
import WorkflowIsland from './WorkflowIsland';
import FacilityIsland from './FacilityIsland';
import WikiPageIsland from './WikiPageIsland';
import BackIsland from './BackIsland';
import NavigationIsland from './NavigationIsland';
import ReactionsIsland from './ReactionsIsland';
import ReviewsIsland from './ReviewsIsland';
import EditsHistoryIsland from './EditsHistoryIsland';
import CollapsiblePanel from 'components/CollapsiblePanel';
import SearchWithin from './SearchWithin';
import SaveSearchIsland from './SaveSearchIsland';
import DownloadCSVIsland from './DownloadCSVIsland';
import ResultSort from './ResultSort';
import ResultLoader from './ResultLoader';
import IslandAggWrapper from './IslandAggWrappper';
import IslandAggWrapper2 from './WfIslandAggWrappper';
import CrumbsBarIsland from './CrumbsBarIsland';

/*
  Common island configuration for MailMerge pages
*/

export const commonIslands = {
  expander: (attributes: Record<string, string>, context, children) => {
    return (
      <CollapsiblePanel
        header={attributes['header'] || 'header'}
        collapsed={attributes['collapsed'] == 'true'}>
        {children}
      </CollapsiblePanel>
    );
  },
};

export const studyIslands: Record<string, IslandConstructor> = {
  ...commonIslands,
  workflow: (attributes: Record<string, string>, context?: any) => (
    <WorkflowIsland name={attributes['name']} onChange={attributes['onChange']} nctId={context?.nctId} />
  ),
  facility: (attributes: Record<string, string>, context?: any) => (
    <FacilityIsland nctId={context?.nctId} />
  ),
  wikipage: (attributes: Record<string, string>, context?: any) => (
    <WikiPageIsland nctId={context?.nctId} />
  ),
  navigation: (attributes: Record<string, string>, context?: any) => (
    <NavigationIsland nctId={context?.nctId} />
  ),
  editshistory: (attributes: Record<string, string>, context?: any) => (
    <EditsHistoryIsland nctId={context?.nctId} />
  ),
  back: (attributes: Record<string, string>, context?: any) => (
    <BackIsland nctId={context?.nctId} />
  ),
  reactions: (attributes: Record<string, string>, context?: any) => (
    <ReactionsIsland nctId={context?.nctId} />
  ),
  reviews: (attributes: Record<string, string>, context?: any) => (
    <ReviewsIsland nctId={context?.nctId} />
  ),
  wfagg: (attributes: Record<string, string>, context?: any) => (
    <IslandAggWrapper2 nctId={context?.nctId} aggId={attributes['id']} />
  ),
};
export const searchIslands: Record<string, IslandConstructor> = {
  ...commonIslands,
  agg: (attributes: Record<string, string>, context?: any) => (
    <IslandAggWrapper aggId={attributes['id']} />
  ),
  searchwithin: (attributes: Record<string, string>, context?: any) => (
    <SearchWithin />
  ),
  crumbsbar: (attributes: Record<string, string>, context?: any) => (
    <CrumbsBarIsland />
  ),
  savesearch: (attributes: Record<string, string>, context?: any) => (
    <SaveSearchIsland />
  ),
  csv: (attributes: Record<string, string>, context?: any) => (
    <DownloadCSVIsland />
  ),
  resultsort: (attributes: Record<string, string>, context?: any) => (
    <ResultSort sortables={attributes['sortBy']}/>
  ),
  resultloader: (attributes: Record<string, string>, context?: any) => (
    <ResultLoader />
  ),
};

