import React, { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import { BeatLoader } from 'react-spinners';
import MailMerge from './MailMerge';
import { GraphqlSchemaType } from './SchemaSelector';
import { IslandConstructor } from './MailMergeView';
import { useFragment } from './MailMergeFragment';

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

const default_nctid = 'NCT00222898';
const getQuery = (name: string, frag: string) => {
  frag = frag || `fragment ${name} on Study { nct_id }`;
  return gql`
  query SampleStudyQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...${name}
    }
  }
  ${frag}
`;
};

export default function MailMergeFormControl(props: MailMergeFormControlProps) {
  const [nctId, setNctId] = useState(default_nctid);
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );
  const [fragmentName, fragment] = useFragment('Study', props.template);
  const { data: study } = useQuery(getQuery(fragmentName, fragment), {
    variables: { nctId: nctId },
  });

  if (!introspection) {
    return <BeatLoader />;
  }

  const schema : GraphqlSchemaType = {
    kind: 'graphql',
    typeName: 'Study',
    types: introspection.__schema.types,
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
        sample={study?.study || {}}
        template={props.template}
        onTemplateChanged={props.onTemplateChanged}
        islands={props.islands}
      />
      {/* <CollapsiblePanel></CollapsiblePanel> */}
    </Container>
  );
}
