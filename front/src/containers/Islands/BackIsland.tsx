import React, { useContext } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents';
import useUrlParams,{ queryStringAll } from 'utils/UrlParamsProvider';

interface Props {
  nctId?: string;
}

export default function BackIsland(props: Props) {
  const { nctId } = props;
  const queryString = useUrlParams();
  const backQuery = queryStringAll(queryString);
  const history = useHistory();
  const name = '⤺︎ Back';

  const navButtonClick = () => () => {
    history.push(`/search${backQuery}`);
  };

  return (
    <div>
      <ThemedButton
        style={{ margin: 'auto', float: 'left' }}
        onClick={navButtonClick()}
        disabled={false}>
        {name}
      </ThemedButton>
    </div>
  );
}
