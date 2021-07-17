import React, { useEffect, useState } from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import MailMerge from './MailMerge';
import { GraphqlSchemaType } from './SchemaSelector';
import { IslandConstructor } from './MailMergeView';
import { useFragment } from './MailMergeFragment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSampleStudy, fetchSampleStudyHasura  } from 'services/study/actions';
import { getSampleStudyQuery, getSampleSearchQuery } from 'services/study/queries';
import { RootState } from 'reducers';
import { fetchSearchParams, updateSearchParamsAction } from 'services/search/actions';
// import { fetchIntrospection } from 'services/introspection/actions';
//import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';
import { fetchHasuraIntrospection, fetchIntrospection, fetchNodeIntrospection } from 'services/introspection/actions';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;
const Container = styled.div`
  max-width: 1200px;
  margin-bottom: 20px;
`;
type Mode = 'Study' | 'Search';

// return a tuple of the elements that differ with the mode
// query, params, schema

function getClassForMode(mode: Mode) {
  switch (mode) {
    case 'Study':
      return 'ctgov_prod_studies';
    case 'Search':
      return 'ElasticStudy';
      
  }
}
interface MailMergeFormControlProps {
  template: string;
  onTemplateChanged: (t: string) => void;
  islands?: Record<string, IslandConstructor>;
  pageType?: any;
}

const default_nctid = 'NCT00004074';
const default_hash = '3de7185d'

export default function MailMergeFormControl(props: MailMergeFormControlProps) {
  const [nctId, setNctId] = useState(default_nctid);
  const [searchHash, setSearchHash] = useState(default_hash);
  const searchParams = useSelector((state: RootState) => state.search.searchResults?.data.searchParams.searchParams);
  // const [mode, setMode] = useState<Mode>('Study');
  const mode = props.pageType
  let [nctOrSearchHash, setNctOrSearchHash] = useState(default_nctid);

  const dispatch = useDispatch();



  const hasuraIntrospection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);
  const nodeIntrospection = useSelector((state: RootState) => state.introspection.nodeIntrospection);
  const schemaType = getClassForMode(mode);
  const [fragmentName, fragment] = useFragment(schemaType, props.template);
  // const [fragmentName, fragment] = useFragment('Study', props.template);
  useEffect(() => {
    const QUERY = introspectionQuery  //`${gql(getIntrospectionQuery({ descriptions: false }))}`
    dispatch( mode == "Study" ? fetchHasuraIntrospection(QUERY) : fetchNodeIntrospection(QUERY));
  }, [dispatch, fragment, mode]);

  useEffect(() => {
    dispatch(fetchSearchParams(searchHash ?? ""));
  }, [dispatch])

  useEffect(() => {
    const STUDY_QUERY = `${getSampleStudyQuery(fragmentName, fragment)}`
    const SEARCH_QUERY = `${getSampleSearchQuery(fragmentName, fragment)}`
    dispatch(mode == "Study" ? fetchSampleStudyHasura(nctId ?? "", STUDY_QUERY) : fetchSampleStudy(searchParams ?? "", SEARCH_QUERY));
  }, [dispatch, fragment, mode, searchParams]);

  const sample = useSelector((state: RootState) => state.study.hasuraSampleStudy);
  const sampleSearch = useSelector((state: RootState) => state.study.sampleStudy);

  if (!nodeIntrospection && mode == "Search") {
    return <BeatLoader />;
  }
  if (!hasuraIntrospection && mode == "Study") {
    return <BeatLoader />;
  }
  if (!sample && mode == "Study") {
    return <BeatLoader />;
  }
  if (!sampleSearch && mode == "Search") {
    return <BeatLoader />;
  }


  // const schema : GraphqlSchemaType = {
  //   kind: 'graphql',
  //   typeName: 'Study',
  //   types: introspection.data.__schema.types,
  // };

  // const schema2: GraphqlSchemaType = {
  //   kind: 'graphql',
  //   typeName: 'Search',
  //   types: introspection.data.__schema.types,
  // };
  const types = mode == "Study" ? hasuraIntrospection.data.__schema.types : nodeIntrospection.data.__schema.types  ;
  const searchData = () => {
    let studies: any[] = []
    sampleSearch?.data?.search?.studies?.map((study, index) => {
      studies.push({ ...study, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL' })
    })
    return studies
  }
  return (
    <Container>
      {/* <StyledFormControl
        placeholder={default_nctid}
        value={nctId}
        onChange={e => setNctId(e.target.value || default_nctid)}
      /> */}
      <MailMerge
        schema={{ kind: 'graphql', typeName: schemaType, types }}
        sample={mode == 'Study' ? (sample?.data?.study) : searchData()}
        template={props.template}
        onTemplateChanged={props.onTemplateChanged}
        islands={props.islands}
        pageType={mode}
      />
      {/* <CollapsiblePanel></CollapsiblePanel> */}
    </Container>
  );
}
