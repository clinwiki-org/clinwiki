import React, { useContext } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents';

interface Props {
  nctId?: string;
}

export default function BackIsland(props: Props) {
  const { nctId } = props;
  const history = useHistory();
  const name = '⤺︎ Back';

  const navButtonClick = () => () => {
    history.goBack();
  };

  return (
    <div style={{ paddingTop: '10px' }}>
      <ThemedButton
        style={{ margin: 'auto', float: 'left' }}
        onClick={navButtonClick()}
        disabled={false}>
        {name}
      </ThemedButton>
    </div>
  );
}
