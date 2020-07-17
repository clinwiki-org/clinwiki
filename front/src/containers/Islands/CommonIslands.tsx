import React from 'react';
import { IslandConstructor } from 'components/MailMerge/MailMergeView';
import WorkflowIsland from './WorkflowIsland';
import FacilityIsland from './FacilityIsland';
import WikiPageIsland from './WikiPageIsland';

/*
  Common island configuration for MailMerge pages
*/

export const pageIslands: Record<string, IslandConstructor> = {
  workflow: (attributes: Record<string, string>, context?: any) => (
    <WorkflowIsland name={attributes['name']} nctId={context?.nctId} />
  ),
  facility: (attributes: Record<string, string>, context?: any) => (
    <FacilityIsland  nctId={context?.nctId} />
  ),
  wikipage: (attributes: Record<string, string>, context?: any) => (
    <WikiPageIsland  nctId={context?.nctId}/>
  ),
};
