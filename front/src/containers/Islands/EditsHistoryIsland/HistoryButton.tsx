import React from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import * as FontAwesome from 'react-fontawesome';

import { trimPath } from 'utils/helpers';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import ThemedButton from 'components/StyledComponents/index';

const HistoryButton = () => {
  let history = useHistory();
  let match = useRouteMatch();
  const params = useUrlParams();
  const historyPath = `${trimPath(match.path)}/wiki/history`;
  const goToEditHistoryUrl = () => {
    history.push(`${historyPath}${queryStringAll(params)}`);
  };

  return (
    <ThemedButton type="button" onClick={goToEditHistoryUrl}>
      History <FontAwesome name="history" />
    </ThemedButton>
  );
};

export default HistoryButton;
