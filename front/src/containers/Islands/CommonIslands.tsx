import React from 'react';
import { IslandConstructor } from 'components/MailMerge/MailMergeView';
import WorkflowIsland from './WorkflowIsland';
import FacilityIsland from './FacilityIsland';
import WikiPageIsland from './WikiPageIsland';
import BackIsland from './BackIsland';
import NavigationIsland from './NavigationIsland';

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
  navigation: (attributes: Record<string, string>, context?: any) => (
    <NavigationIsland  nctId={context?.nctId}/>
  ),
  back: (attributes: Record<string, string>, context?: any) => (
    <BackIsland  nctId={context?.nctId}/>
  ),

};
