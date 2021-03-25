import React, { useEffect, useState } from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import MailMerge from './MailMerge';
import { GraphqlSchemaType } from './SchemaSelector';
import { IslandConstructor } from './MailMergeView';
import { useFragment } from './MailMergeFragment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSampleStudy } from 'services/study/actions';
import { getSampleStudyQuery } from '../../components/MailMerge/MailMergeUtils';
import { RootState } from 'reducers';
import { fetchIntrospection } from 'services/introspection/actions';
//import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;
const Container = styled.div`
  max-width: 1200px;
  margin-bottom: 20px;
`;

interface MailMergeFormControlProps {
  template: string;
  onTemplateChanged: (t: string) => void;
  islands?: Record<string, IslandConstructor>;
}

const default_nctid = 'NCT00004074';

export default function MailMergeFormControl(props: MailMergeFormControlProps) {
  const [nctId, setNctId] = useState(default_nctid);
  const dispatch = useDispatch();

  useEffect(() => {
    const QUERY = introspectionQuery  //`${gql(getIntrospectionQuery({ descriptions: false }))}`
    dispatch(fetchIntrospection(QUERY));
  }, [dispatch]);

  const introspection = useSelector((state: RootState) => state.introspection.introspection);

  const [fragmentName, fragment] = useFragment('Study', props.template);

  useEffect(() => {
    const QUERY = `${getSampleStudyQuery(fragmentName, fragment)}`
    dispatch(fetchSampleStudy(nctId ?? "", QUERY));
  }, [dispatch, fragment]);

  const study = useSelector((state: RootState) => state.study.sampleStudy);

  if (!study) {
    return <BeatLoader />;
  }

  if (!introspection) {
    return <BeatLoader />;
  }

  const schema: GraphqlSchemaType = {
    kind: 'graphql',
    typeName: 'Study',
    types: introspection.data.__schema.types,
  };

  return (
    <Container>
      <StyledFormControl
        placeholder={default_nctid}
        value={nctId}
        onChange={e => setNctId(e.target.value || default_nctid)}
      />
      <MailMerge
        schema={schema}
        sample={study?.data?.study || {}}
        template={props.template}
        onTemplateChanged={props.onTemplateChanged}
        islands={props.islands}
      />
      {/* <CollapsiblePanel></CollapsiblePanel> */}
    </Container>
  );
}
