import React, { useEffect, useState } from 'react';
import MailMerge from './MailMerge';
import { FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import { getStudyQuery, getSearchQuery } from './MailMergeUtils';
import { commonIslands } from 'containers/Islands/CommonIslands';
import { useFragment } from './MailMergeFragment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIntrospection } from 'services/introspection/actions';
import { RootState } from 'reducers';
import { introspectionQuery } from 'graphql/utilities';
import { BeatLoader } from 'react-spinners';
import { fetchStudyPage, fetchSearchPageMM } from 'services/study/actions';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
type Mode = 'Study' | 'Search';
// return a tuple of the elements that differ with the mode
// query, params, schema
function getClassForMode(mode: Mode) {
  switch (mode) {
    case 'Study':
      return 'Study';
    case 'Search':
      return 'ElasticStudy';
  }
}
const STUDY_TEMPLATE = `
<wfagg id="3"></wfagg>
`;
const SEARCH_TEMPLATE = `

<div class="grid-container">
<div class="grid3">
  <div class="one">
    <agg id='2'></agg>
    <agg id='3'></agg>
    <agg id='2'></agg>    

  <div class="mm-card2 card-subgrid">
    <span class="a1"> A1 </span>
    <span class="a2">A2</span>
    <span class="b3"> B3 </span>
    <span class="b4">B4</span>
    <span class="c1">C1</span>
    <span class="c2"> C2 </span>
    <span class="d3"> D3 </span>
    <span class="d4">D4</span>
    <span class="e1"> E1 </span>
    <span class="e2">E2</span>
    <span class="f3"> F3 </span>
    <span class="f4">F4</span>
  </div>


</div>
  <div class="two">    
<searchwithin></searchwithin>
<div class="mm-single-line-center">
    <agg id='2'></agg>
    <agg id='3'></agg>
    <agg id='2'></agg>
</div>

</div>
  <div class="three  loader-container subgrid">
  <resultloader></resultloader>
<div class="mm-single-line a1">
<savesearch></savesearch>
<csv></csv>
</div>
<div class="a2"></div>

<div class="a3">
<resultsort></resultsort>
</div>
<div class="a4"></div>

<div class="cards-container b1" key={{querystring ALL}}>
{{#each studies }}
<div class="mm-card2">
  <div class ="mail-merge" >
    <span> ID: <a href="/search{{querystring ALL}} ">{{nctId}}</a></span><br/>
    <span>Title: {{briefTitle}}</span><br/><span>Summary: {{briefSummary}}</span>
  </div>
</div>
{{/each }}
</div>

</div>

</div>

  

 </div>

`
export default function TestComponent() {
  const [template, setTemplate] = useState(STUDY_TEMPLATE);
  const [mode, setMode] = useState<Mode>('Study');
  const defaultNctId = 'NCT03847779';
  const defaultSearchHash = 'tqxCyI9M';
  let [nctOrSearchHash, setNctOrSearchHash] = useState(defaultNctId);
  const dispatch = useDispatch();

  useEffect(() => {
    const QUERY = introspectionQuery
    dispatch(fetchIntrospection(QUERY));
  }, [dispatch]);

  useEffect(() => {
    const STUDY_QUERY = `${getStudyQuery(fragmentName, fragment)}`
    const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`
    dispatch(mode == "Study" ? fetchStudyPage(nctOrSearchHash ?? "", STUDY_QUERY) : fetchSearchPageMM(nctOrSearchHash ?? "", SEARCH_QUERY));
  }, [dispatch, nctOrSearchHash]);

  const introspection = useSelector((state: RootState) => state.introspection.introspection);
  const schemaType = getClassForMode(mode);
  const [fragmentName, fragment] = useFragment(schemaType, template);
  const studyData = useSelector((state: RootState) => state.study.studyPage);
  const aggsList = useSelector((state: RootState) => state.search.aggs);
  const recordsTotal = aggsList?.data?.search?.recordsTotal;

  const updateMode = mode => {
    setMode(mode);
    if (mode === 'Study') {
      setTemplate(STUDY_TEMPLATE)
      setNctOrSearchHash(defaultNctId);
    }
    if (mode === 'Search') {
      setTemplate(SEARCH_TEMPLATE)
      setNctOrSearchHash(defaultSearchHash);
    }
  };
  let islands = mode == 'Study' ? studyIslands : searchIslands;
  islands = {
    ...islands,
    groot: (attributes: Record<string, string>) => {
      return (
        <img src="https://media.giphy.com/media/11vDNL1PrUUo0/source.gif" />
      );
    },
  };
  if (!introspection || !studyData) {
    return <BeatLoader />;
  }
  const searchData = () => {
    let studies: any[] = []
    studyData?.data?.search?.studies?.map((study, index) => {
      studies.push({ ...study, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL' })
    })
    return { studies, recordsTotal }
  }
  if (introspection) {
    const types = introspection.data.__schema.types;
    return (
      <div>
        <DropdownButton
          bsStyle="default"
          title={`Type: ${mode}`}
          key={mode}
          style={{ marginBottom: '10px' }}>
          <MenuItem onClick={_ => updateMode('Study')}>Study</MenuItem>
          <MenuItem onClick={_ => updateMode('Search')}>Search</MenuItem>
        </DropdownButton>
        <FormControl
          placeholder="Select an nctid"
          value={nctOrSearchHash}
          onChange={e => setNctOrSearchHash(e.target.value || defaultNctId)}
        />
        <MailMerge
          schema={{ kind: 'graphql', typeName: schemaType, types }}
          sample={studyData?.data?.study || searchData()}
          template={template}
          onTemplateChanged={setTemplate}
          islands={islands}
          pageType={mode}
        />
        <pre>{fragment}</pre>
        <pre>
          {JSON.stringify(studyData?.data?.study || studyData.data?.search?.studies, null, 2)}
        </pre>
      </div>
    );
  }
  return <div>?</div>;
}