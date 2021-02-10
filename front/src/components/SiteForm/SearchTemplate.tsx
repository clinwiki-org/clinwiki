import React, { useEffect, useState }from 'react';
import { MailMergeEditor } from 'components/MailMerge';	
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import MailMerge from '../MailMerge/MailMerge';
import { GraphqlSchemaType } from '../MailMerge/SchemaSelector';
import { fromPairs } from 'ramda';
import { useQuery, gql} from '@apollo/client';
import { SchemaType } from 'components/MailMerge/SchemaSelector';
import { camelCase } from 'utils/helpers';
import { useFragment } from '../MailMerge/MailMergeFragment'
import { getStudyQuery } from '../MailMerge/MailMergeUtils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIntrospection } from 'services/introspection/actions';
import { RootState } from 'reducers';
import { introspectionQuery } from 'graphql/utilities';
import { fetchStudyPage } from 'services/study/actions';


interface Props {
  template: string;
  onTemplateChanged: (template: string) => void;
  fields: string[];
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

const Container = styled.div`
  max-width: 1200px;
`;

const default_nctid = 'NCT00222898';

function SearchTemplate(props: Props) {
  const [nctId, setNctId] = useState(default_nctid);
  const [fragmentState, setFragment] = useState('');

  const dispatch = useDispatch();

  useEffect(()=>{
    const QUERY = introspectionQuery 
    dispatch(fetchIntrospection(QUERY));
  },[dispatch]);

  useEffect(()=>{
    const QUERY = `${getStudyQuery(fragmentName, fragment)}`
    dispatch(fetchStudyPage(nctId ?? "", QUERY));
  },[dispatch]);

  const introspection = useSelector((state:RootState) => state.introspection.introspection);


  const [fragmentName, fragment] = useFragment('Study', props.template);
  // const { data: study } = useQuery(getStudyQuery(fragmentName, fragment), {
  //   variables: { 
  //     nctId: nctId
  //    },
  // });

  const study= useSelector((state:RootState) => state.study.studyPage);

  if (!introspection) {
    return <BeatLoader />;
  }
  const types = introspection.data.__schema.types;
  return (
    <Container>
      <StyledFormControl
        placeholder={default_nctid}
        value={nctId}
        onChange={e => setNctId(e.target.value || default_nctid)}
      />
      <MailMergeEditor
        schema={{ kind: 'graphql', typeName: 'Study', types }}
        sample={study?.data?.study || {}}
        template={props.template}
        onTemplateChanged={props.onTemplateChanged}
      />
    </Container>
  );
}

export default SearchTemplate;
