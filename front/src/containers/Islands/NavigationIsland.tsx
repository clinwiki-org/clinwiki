import React, { useContext, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import ThemedButton from 'components/StyledComponents';
import QUERY from 'queries/SearchStudyPageQuery';
import { useHistory, useRouteMatch } from "react-router-dom";
import { BeatLoader, PulseLoader } from 'react-spinners';
import StudyPageCounter from '../StudyPage/components/StudyPageCounter'
import { path, pathOr } from 'ramda';
import { trimPath } from 'utils/helpers';
import useUrlParams, {queryStringAll} from 'utils/UrlParamsProvider';
import { fetchSearchStudyPage } from 'services/study/actions';
import {RootState} from 'reducers';

interface Props {
  nctId?: string;
}

export default function NavigationIsland(props: Props) {
  const { nctId } = props;
  let history = useHistory();
  let match = useRouteMatch();

  const params = useUrlParams()
  const hash = params.hash
  const siteViewUrl = params.sv
  const variables = {
    hash: hash,
    id: nctId,
  };
/*  const { data: data } = useQuery<SearchStudyPageQuery>(QUERY, {
    variables: variables,
  });
*/
  const dispatch = useDispatch();
  const studySearchPageData = useSelector( (state: RootState) => state.study.searchStudyPage);
  useEffect (() => {
    dispatch (fetchSearchStudyPage(hash, (variables.id || "")));
  },[dispatch, nctId]);

  const handleNavButtonClick = (link: string) => () => {
    history.push(`${trimPath(link)}`);
  };
  const renderNavButton = (name: string, link?: string | null) => {
    if (link === undefined) return null;

    return (
      <ThemedButton
        style={{ marginRight: 10, marginBottom: 10 }}
        onClick={handleNavButtonClick(link!)}
        disabled={link === null}>
        {name}
      </ThemedButton>
    );
  };
    let prevLink: string | null | undefined = null;
    let nextLink: string | null | undefined = null;
    let firstLink: string | null | undefined = null;
    let lastLink: string | null | undefined = null;
    let isWorkflow: boolean = false;
    let recordsTotal: number | JSX.Element | null | undefined = (
      <div id="divsononeline">
        <PulseLoader color="#cccccc" size={8} />
      </div>
    );
    let counterIndex: number | Element | null | undefined = null;
    let workflowName: string | null = null;

    if(!studySearchPageData) return <BeatLoader/>

    const prevId = path(['search', 'studyEdge', 'prevId'], studySearchPageData.data);
    const nextId = path(['search', 'studyEdge', 'nextId'], studySearchPageData.data);
    const firstId = path(['search', 'studyEdge', 'firstId'], studySearchPageData.data);
    const lastId = path(['search', 'studyEdge', 'lastId'], studySearchPageData.data);
    isWorkflow = pathOr(
      false,
      ['search', 'studyEdge', 'isWorkflow'],
      studySearchPageData.data
    ) as boolean;
    workflowName = pathOr(
      false,
      ['search', 'studyEdge', 'workflowName'],
      studySearchPageData.data
    ) as string | null;

    // counterIndex will remain null if it's >200 or whatever we set the max page size to
    counterIndex = path(['search', 'studyEdge', 'counterIndex'], studySearchPageData.data);
    recordsTotal =
    counterIndex &&
      (pathOr(
        1,
        ['search', 'studyEdge', 'recordsTotal'],
        studySearchPageData.data
      ) as number);
      let url = match.url
      const updatedPath = url.substring(0, url.lastIndexOf('/')); 
    nextLink =
      nextId &&
      `${updatedPath}/${nextId}${queryStringAll(params)}`;
    prevLink =
      prevId &&
      `${updatedPath}/${prevId}${queryStringAll(params)}`;

    // just so that there isn't a first button if there isn't a prev button
    // likewise for the last button
    if (prevLink != null) {
      firstLink =
        firstId &&
        `${updatedPath}/${firstId}${queryStringAll(params)}`;
      // firstId && `/search/${variables.hash}/study/${firstId}`;
    }
    if (nextLink != null && counterIndex != null) {
      lastLink =
        lastId &&
        `${updatedPath}/${lastId}${queryStringAll(params)}`;
    }
  return (
    <div className="navigation-island">
      <div id="navbuttonsonstudypage">
        {renderNavButton(
          '❮❮ First',
          firstLink
        )}
      </div>
      <div id="navbuttonsonstudypage">
        {renderNavButton(
          '❮ Previous',
          prevLink
        )}
      </div>
      <div id="navbuttonsonstudypage">
        <StudyPageCounter
          counter={counterIndex!}
          recordsTotal={recordsTotal!}
        />
      </div>
      <div id="navbuttonsonstudypage">
        {renderNavButton(
          'Next ❯',
          nextLink
        )}
      </div>
      <div id="navbuttonsonstudypage">
        {renderNavButton(
          'Last ❯❯',
          lastLink
        )}
      </div> 
    </div>
  );
}
