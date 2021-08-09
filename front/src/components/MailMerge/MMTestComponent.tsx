import React, { useEffect, useState } from 'react';
import MailMerge from './MailMerge';
import { FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import { getStudyQuery, getSearchQuery, getHasuraStudyQuery } from 'components/MailMerge/MailMergeUtils';
import { commonIslands } from 'containers/Islands/CommonIslands';
import { useFragment } from './MailMergeFragment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNodeIntrospection, fetchIntrospection, fetchHasuraIntrospection } from 'services/introspection/actions';
import { RootState } from 'reducers';
import { introspectionQuery } from 'graphql/utilities';
import { BeatLoader } from 'react-spinners';
import { fetchStudyPage, fetchSearchPageMM, fetchStudyPageHasura } from 'services/study/actions';
import { studyIslands, searchIslands } from 'containers/Islands/CommonIslands'
import { useHasuraFragment } from 'components/MailMerge/HasuraMMFragment';
import { GraphqlSchemaType } from './SchemaSelector';


type Mode = 'Study' | 'Search';
// return a tuple of the elements that differ with the mode
// query, params, schema
function getClassForMode(mode: Mode) {
  switch (mode) {
    case 'Study':
      return 'ctgov_prod';
    case 'Search':
      return 'ElasticStudy';
  }
}


const STUDY_TEMPLATE3 = `


{{#each ctgov_prod_studies_clinwiki_crowd_key_value_ids}}
{{#iff (crowd_key '==' 'Mutations Targeted' '')}}
<b>{{crowd_key}} :</b> 

{{/iff}}

true
{{/each}}

`
const STUDY_TEMPLATE2 = `

<div style="max-width: 80%; padding-left: 10%;">
<a class=btn title='Back to Search Results' href=/search?hash={{querystring hash}}&pv=cards><i class="fa fa-arrow-circle-left fa-2x">&nbsp;Back to Search Results</a>

<h2 style="text-align:center">{{brief_title}}</h2>




<Expander header="Clinwiki Tags">
<a href="/study/{{nct_id}}?hash={{querystring hash}}&pv=workflow1">Edit</a>

<span class="crumb-wrapper">


{{#each ( $Reduce ctgov_prod_studies_clinwiki_crowd_key_value_ids )}}
<b>{{crowd_key}} :</b> 
  <span class="crumb-container">&nbsp;{{crowd_value}}  &nbsp;</span> 
{{/each}}





</span>
</Expander>

</div>

`;
const STUDY_TEMPLATE = `
<div style="max-width: 80%; padding-left: 10%;">
<a class=btn title='Back to Search Results' href=/search?hash={{querystring hash}}&pv=cards><i class="fa fa-arrow-circle-left fa-2x">&nbsp;Back to Search Results</a>

<h2 style="text-align:center">{{brief_title}}</h2>

<Expander header="Clinwiki Tags">
<a href="/study/{{nct_id}}?hash={{querystring hash}}&pv=workflow1">Edit</a>

<span class="crumb-wrapper">

{{#each ctgov_prod_studies_clinwiki_crowd_key_value_ids}}
<b>{{crowd_key}} :</b> 
  <span class="crumb-container">&nbsp;{{crowd_value}}  &nbsp;</span> 
{{/each}}





</span>
</Expander>





</div>
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
  const [template, setTemplate] = useState(STUDY_TEMPLATE2);
  const [mode, setMode] = useState<Mode>('Study');
  const defaultNctId = 'NCT04507503';
  const defaultSearchHash = 'tqxCyI9M';
  let [nctOrSearchHash, setNctOrSearchHash] = useState(defaultNctId);
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.search.searchResults);

  useEffect(() => {
    const QUERY = introspectionQuery
    mode == "Search" ? dispatch(fetchNodeIntrospection(QUERY)): dispatch(fetchHasuraIntrospection(QUERY));
  }, [dispatch]);


  const introspection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);
  const schemaType = getClassForMode(mode);
  const [fragmentName, fragment] = useFragment(schemaType, SEARCH_TEMPLATE || '');
  const [hasuraFragmentName, hasuraFragment] = useHasuraFragment('ctgov_prod_studies', template || '');

  const studyData = useSelector((state: RootState) => state.study.studyPage);
  const aggsList = useSelector((state: RootState) => state.search.aggs);
  const recordsTotal = aggsList?.data?.search?.recordsTotal;

  useEffect(() => {
    let searchParams = mode == "Search" ? { ...data.data.searchParams } : null;

    const HASURA_STUDY_QUERY = `${getHasuraStudyQuery(hasuraFragmentName, hasuraFragment)}`
    const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`

    dispatch(mode == "Study" ?  fetchStudyPageHasura(defaultNctId ?? "", HASURA_STUDY_QUERY) : fetchSearchPageMM(searchParams.searchParams, SEARCH_QUERY))
  }, [dispatch, fragment, hasuraFragment]);
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

  const schema: GraphqlSchemaType = {
    kind: 'graphql',
    typeName: 'ctgov_prod_studies',
    types: introspection.data.__schema.types,
};

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
          schema={mode == "Study" ? schema : { kind: 'graphql', typeName: schemaType, types } }
          sample={studyData?.data?.ctgov_prod_studies[0] || searchData()}
          template={template}
          onTemplateChanged={setTemplate}
          islands={islands}
          pageType={mode}
        />
        <pre>{mode =='Study' ? hasuraFragment: fragment}</pre>
        <pre>
          {JSON.stringify(studyData?.data?.study || studyData.data?.search?.studies, null, 2)}
        </pre>
      </div>
    );
  }
  return <div>?</div>;
}