import React, { useEffect, useState } from 'react';
import {
  DocumentNode,
} from 'graphql';
import { gql, useQuery }  from '@apollo/client';
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
import { fetchStudyPage } from 'services/study/actions';


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

function getModeData(
  mode: Mode,
  arg: string,
  fragment: string,
  fragmentName: string
): [DocumentNode, object, string] {
  switch (mode) {
    case 'Study':
      return [getStudyQuery(fragmentName, fragment), { nctId: arg }, 'Study'];
    case 'Search':
      return [
        getSearchQuery(fragmentName, fragment),
        { hash: arg },
        'ElasticStudy',
      ];
  }
}
const template1= `
<navigation></navigation>
{{nctId}}  
{{$TRUNCATE briefTitle 5}}
{{$TRUNCATE nctId 5}}

{{briefTitle}}  
{{briefSummary}}  
`
const template2= `
# title: Search Page
{{#$RenderEach studies }}
{{nctId}}  
{{briefTitle}}  
{{briefSummary}}  
{{/$RenderEach }}
`
const template3= `
# title: Search Page
{{#each studies }}
<div class="testing-mm">
  <div class ="mail-merge" >
    <span>ID: <a href="/search{{querystring ALL}} ">{{nctId}}</a></span><br/>
    <span>Title: {{briefTitle}}</span><br/><span>Summary: {{briefSummary}}</span>
  </div>
</div>
{{/each }}

`
export default function TestComponent() {
  const [template, setTemplate] = useState(template3);
  const [mode, setMode] = useState<Mode>('Search');
  const defaultNctId = 'NCT03847779';
  const defaultSearchHash = 'tqxCyI9M';
  let [nctOrSearchHash, setNctOrSearchHash] = useState(defaultSearchHash);

  const dispatch = useDispatch();

  useEffect(()=>{
    const QUERY = introspectionQuery
    dispatch(fetchIntrospection(QUERY));
  },[dispatch]);

  useEffect(()=>{
    const QUERY = `${getStudyQuery(fragmentName, fragment)}`
    dispatch(fetchStudyPage(nctOrSearchHash ?? "", QUERY));
    console.log(mode)
    const STUDY_QUERY = `${getStudyQuery(fragmentName, fragment)}`
    const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`
    dispatch(mode=="Study" ? fetchStudyPage(nctOrSearchHash ?? "", STUDY_QUERY) : fetchStudyPage(nctOrSearchHash ?? "", SEARCH_QUERY) );
   },[dispatch, nctOrSearchHash]);

  const introspection = useSelector((state:RootState) => state.introspection.introspection);


  const schemaType = getClassForMode(mode);
  const [fragmentName, fragment] = useFragment(schemaType, template);
  const [query, variables] = getModeData(mode, nctOrSearchHash, fragment, fragmentName);
  console.log("QUERY",query);
  const { data } = useQuery(query, { variables });
console.log("FRAG", fragmentName, fragment)
  const updateMode = mode => {
    setMode(mode);
    if (mode === 'Study') setNctOrSearchHash(defaultNctId);
    if (mode === 'Search') setNctOrSearchHash(defaultSearchHash);
  };

  const islands = {
    ...commonIslands,
    groot: (attributes: Record<string, string>) => {
      return (
        <img src="https://media.giphy.com/media/11vDNL1PrUUo0/source.gif" />
      );
    },
  };

  const sampleData = data?.study || data?.search?.studies?.[0];
  const searchData = ()=> {
      let studies : any[]=[]
    data?.search?.studies?.map((study, index)=>{
      studies.push( {...study, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL'})
    })
    // const context = pageType=="Study"? { ...studyData?.data.study, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL' }
  // :{ hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL', studies:  searchData() }// const context = pageType=="Study"? { ...studyData?.data.study, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL' }
  // :{ hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL', studies:  searchData() }
    return studies
  }


  if (!introspection) {
    return <BeatLoader />;
  }

  console.log(searchData())
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
          // sample={data?.study || data?.search?.studies[0]}
          // sample={data?.study || data?.search?.studies}
          sample={data?.study || searchData()}
          template={template}
          onTemplateChanged={setTemplate}
          islands={islands}
          pageType={mode}
        />
        <pre>{fragment}</pre>
        <pre>
          {JSON.stringify(studyData?.data.study  ||studyData.data?.search?.studies, null, 2)}
        </pre>
      </div>
    );
  }
  return <div>?</div>;
}
