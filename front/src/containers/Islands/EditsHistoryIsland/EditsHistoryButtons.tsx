import React from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import { partition, toPairs, map } from 'ramda';

import { trimPath } from 'utils/helpers';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import ThemedButton from 'components/StyledComponents/index';
import ExpansionContext from './ExpansionContext';

const ExpandHistoryButtons = ({ history, match }) => (
  <ExpansionContext.Consumer>
    {({ historyExpanded, setHistoryExpanded }) => {
      const params = useUrlParams();

      const toggleAllEdits = (value: boolean) => {
        const toggledHistory = map(() => value, historyExpanded);
        setHistoryExpanded(toggledHistory);
      };

      const handleView = () => {
        history.push(`${trimPath(match.url)}${queryStringAll(params)}`);
      };

      const [maximized, minimized] = partition(
        ([_, v]) => v,
        toPairs(historyExpanded)
      );

      return (
        <div>
          <ThemedButton
            type="button"
            onClick={handleView}
            style={{ marginLeft: '10px' }}>
            View <FontAwesome name="photo" />
          </ThemedButton>
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

const EditsHistoryButtons = () => {
  let match = useRouteMatch();
  let history = useHistory();
  const params = useUrlParams();
  const historyPath = `${trimPath(match.path)}/wiki/history`;
  const goToEditHistoryUrl = () => {
    history.push(`${historyPath}${queryStringAll(params)}`);
  };

  return (
    <Switch>
      <Route path={historyPath} component={ExpandHistoryButtons} />
      <Route
        render={() => {
          return (
            <ThemedButton type="button" onClick={goToEditHistoryUrl}>
              History <FontAwesome name="history" />
            </ThemedButton>
          );
        }}
      />
    </Switch>
  );
};

export default EditsHistoryButtons;
