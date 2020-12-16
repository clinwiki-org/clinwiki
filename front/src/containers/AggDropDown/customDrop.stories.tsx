// YourComponent.stories.tsx

import React, { ComponentProps } from 'react';
import { Story } from '@storybook/react/types-6-0';

import CustomDropDown from './CustomDrop';

// This default export determines where your story goes in the story list
export default {
  title: 'CustomDrop',
  component: CustomDropDown,
};

const Template: Story<ComponentProps<typeof CustomDropDown>> = (args) => (
  <CustomDropDown {...args} />
);

export const CustomDropdownStory = Template.bind({});
CustomDropdownStory.args = {
  /* the args you need here will depend on your component */
};