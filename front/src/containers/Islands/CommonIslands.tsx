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
    <WorkflowIsland name={attributes['name']} nctId={context?.nctId} />
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
};
