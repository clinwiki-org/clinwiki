import React from 'react';
import { Switch, Route } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import { partition, toPairs, map } from 'ramda';

import ThemedButton from 'components/StyledComponents/index';
import HistoryButton from './EditsHistoryButtons';
import ExpansionContext from './ExpansionContext';

const ExpandHistoryButtons = () => (
  <ExpansionContext.Consumer>
    {({ historyExpanded, setHistoryExpanded }) => {
      const [maximized, minimized] = partition(
        ([_, v]) => v,
        toPairs(historyExpanded)
      );

      const toggleAllEdits = (value: boolean) => {
        const toggledHistory = map(() => value, historyExpanded);
        setHistoryExpanded(toggledHistory);
      };

      return (
        <div>
          {minimized.length > 0 && (
            <ThemedButton
              type="button"
              onClick={() => toggleAllEdits(true)}
              style={{ marginLeft: '10px' }}>
              Expand History <FontAwesome name="expand" />
            </ThemedButton>
          )}
          {maximized.length > 0 && (
            <ThemedButton
              type="button"
              onClick={() => toggleAllEdits(false)}
              style={{ marginLeft: '10px' }}>
              Minimize History <FontAwesome name="compress" />
            </ThemedButton>
          )}
        </div>
      );
    }}
  </ExpansionContext.Consumer>
);

const EditsHistoryButtons = () => (
  <Switch>
    <Route component={HistoryButton} />
    <Route component={ExpandHistoryButtons} />
  </Switch>
);

export default EditsHistoryButtons;
