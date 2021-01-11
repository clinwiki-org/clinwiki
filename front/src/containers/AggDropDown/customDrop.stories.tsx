// YourComponent.stories.tsx

import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react';

import CustomDropDown from './CustomDrop';
import { FieldDisplay } from 'types/globalTypes';
import withTheme, { ProvideTheme } from 'containers/ThemeProvider/ThemeProvider';

// This default export determines where your story goes in the story list
export default {
  title: 'CustomDrop',
  component: CustomDropDown,
  // decorators: [(Story)=> <div>{ProvideTheme(<Story/>)}</div>]
};

const Template: Story<ComponentProps<typeof CustomDropDown>> = (args) => (
  <div style={{maxWidth:'300px'}}>
  <CustomDropDown {...args} />
  
</div>
);
const emptySet: Set<string> = new Set() as Set<string>;

export const PresearchWondros = Template.bind({});
PresearchWondros.args = {

  /* the args you need here will depend on your component */
  buckets: [
    { docCount: 2,
      key: "Completed",
      // keyAsString: "Completed",
    },
    { docCount: 4,
      key: "Unknown status",
      // keyAsString: "Uknown status",
    },],
  field: {
    aggSublabel: "What Phase trial are you looking for?",
    autoSuggest: false,
    bucketKeyValuePairs: null,
    defaultToOpen: null,
    display: "STRING",
    displayName: "overall_status",
    name: "overall_status",
    order: {
      desc: true,
      sortKind: "key",
    },
    preselected: {
      kind: "WHITELIST",
      values: []
    },
    rangeEndLabel: null,
    rangeStartLabel: null,
    rank: 3,
    showAllowMissing: null,
    showFilterToolbar: null,
    visibleOptions: {
      kind: "WHITELIST",
      values: []
    }
  },
  isPresearch: true,
  selectedKeys:emptySet,
  onContainerToggle: ()=>console.log("toggle"),
  handleLoadMore: ()=>console.log("HandleLoadMore")

};
export const PresearchWondrosOpen = Template.bind({});
PresearchWondrosOpen.args = {

  /* the args you need here will depend on your component */
  buckets: [
    { docCount: 2,
      key: "Completed",
      // keyAsString: "Completed",
    },
    { docCount: 4,
      key: "Unknown status",
      // keyAsString: "Uknown status",
    },],
  field: {
    aggSublabel: "What Phase trial are you looking for?",
    autoSuggest: false,
    bucketKeyValuePairs: null,
    defaultToOpen: true,
    display: "STRING",
    displayName: "overall_status",
    name: "overall_status",
    order: {
      desc: true,
      sortKind: "key",
    },
    preselected: {
      kind: "WHITELIST",
      values: []
    },
    rangeEndLabel: null,
    rangeStartLabel: null,
    rank: 3,
    showAllowMissing: null,
    showFilterToolbar: null,
    visibleOptions: {
      kind: "WHITELIST",
      values: []
    }
  },
  isPresearch: true,
  selectedKeys:emptySet,
  onContainerToggle: ()=>console.log("toggle"),
  handleLoadMore: ()=>console.log("HandleLoadMore")

};
export const FacetBar = Template.bind({});
FacetBar.args = {
  /* the args you need here will depend on your component */
  buckets: [
    { key: "United States", docCount: 1 },
    { key: "Canada", docCount: 2 },],
    field: {
      aggSublabel: null,
      autoSuggest: false,
      bucketKeyValuePairs: null,
      defaultToOpen: null,
      display: "checkbox",
      displayName: "overall_status",
      name: "overall_status",
      order: {
        desc: true,
        sortKind: "key",
      },
      preselected: {
        kind: "WHITELIST",
        values: []
      },
      rangeEndLabel: null,
      rangeStartLabel: null,
      rank: 3,
      showAllowMissing: null,
      showFilterToolbar: true,
      visibleOptions: {
        kind: "WHITELIST",
        values: []
      }
    },
    isPresearch: false,
    selectedKeys:emptySet,
    onContainerToggle: ()=>console.log("toggle"),
    handleLoadMore: ()=>console.log("HandleLoadMore")


};
export const StandardPresearch = Template.bind({});
StandardPresearch.args = {
  /* the args you need here will depend on your component */
  buckets: [
    { key: "United States", docCount: 1 },
    { key: "Canada", docCount: 2 },],
  field: {
    aggSublabel: null,
    autoSuggest: false,
    bucketKeyValuePairs: null,
    defaultToOpen: true,
    dropDownDefaultOpen: true,
    display: "checkbox",
    displayName: "overall_status",
    name: "overall_status",
    order: {
      desc: true,
      sortKind: "key",
    },
    preselected: {
      kind: "WHITELIST",
      values: []
    },
    rangeEndLabel: null,
    rangeStartLabel: null,
    rank: 3,
    showAllowMissing: null,
    showFilterToolbar: true,
    visibleOptions: {
      kind: "WHITELIST",
      values: []
    }
  
},
isPresearch: true,
selectedKeys:emptySet,
onContainerToggle: ()=>console.log("toggle"),
handleLoadMore: ()=>console.log("HandleLoadMore")


};
