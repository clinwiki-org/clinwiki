import React from 'react';
import { useRouteMatch, useHistory, Route } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import { partition, toPairs, map } from 'ramda';

import { trimPath } from 'utils/helpers';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import ThemedButton from 'components/StyledComponents/index';
import EditsExpansionContext from 'components/Edits/EditsExpansionContext';

const ExpandHistoryButtons = () => {
  return (
    <EditsExpansionContext.Consumer>
      {({ historyExpanded, setHistoryExpanded }) => {
        const toggleAllEdits = (value: boolean) => {
          const toggledHistory = map(() => value, historyExpanded);
          setHistoryExpanded(toggledHistory);
        };

        const [maximized, minimized] = partition(
          ([_, v]) => v,
          toPairs(historyExpanded)
        );

        return (
          <>
            {minimized.length > 0 && (
              <ThemedButton type="button" onClick={() => toggleAllEdits(true)}>
                Expand History <FontAwesome name="expand" />
              </ThemedButton>
            )}
            {maximized.length > 0 && (
              <ThemedButton type="button" onClick={() => toggleAllEdits(false)}>
                Minimize History <FontAwesome name="compress" />
              </ThemedButton>
            )}
          </>
        );
      }}
    </EditsExpansionContext.Consumer>
  );
};

const HistoryToggleButton = () => {
  let match = useRouteMatch();
  let history = useHistory();
  const params = useUrlParams();
  const studyPath = trimPath(match.url);

  const goToEditHistoryUrl = () => {
    history.push(`${studyPath}/wiki/history${queryStringAll(params)}`);
  };

  const goToViewUrl = () => {
    history.push(`${studyPath}/wiki${queryStringAll(params)}`);
  };

  return (
    <>
      <Route
        exact
        path={`${studyPath}/wiki`}
        render={() => (
          <ThemedButton type="button" onClick={goToEditHistoryUrl}>
            History <FontAwesome name="history" />
          </ThemedButton>
        )}
      />
      <Route
        exact
        path={`${studyPath}/wiki/history`}
        render={() => (
          <ThemedButton type="button" onClick={goToViewUrl}>
            View <FontAwesome name="photo" />
          </ThemedButton>
        )}
      />
    </>
  );
};

const EditsHistoryButtons = () => {
  let match = useRouteMatch();

  return (
    <div
      style={{
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <HistoryToggleButton />
      <Route
        path={`${match.path}/wiki/history`}
        component={ExpandHistoryButtons}
      />
    </div>
  );
};

export default EditsHistoryButtons;
