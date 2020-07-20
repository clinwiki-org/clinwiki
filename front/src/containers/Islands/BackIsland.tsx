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
  const hash = new URLSearchParams(history.location.search)
    .getAll('hash')
    .toString();
  const siteViewUrl = new URLSearchParams(history.location.search)
    .getAll('sv')
    .toString();
  const backLink = () => {
    if (hash !== '') {
      return `/search?hash=${hash}&sv=${siteViewUrl}`;
    }
    return undefined;
  };
  const link = backLink();
  const navButtonClick = (link: string) => () => {
    console.log('Link', link);
    history.push(`${trimPath(link)}`);
  };
  if (link === undefined) return null;

  return (
    <div style={{ paddingTop: '10px' }}>
      <ThemedButton
        style={{ margin: 'auto', float: 'left' }}
        onClick={navButtonClick(link!)}
        disabled={link === null}>
        {name}
      </ThemedButton>
    </div>
  );
}
