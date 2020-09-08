import React, { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import { Spinner } from 'reactstrap';
import MailMerge from './MailMerge';
import { GraphqlSchemaType } from './SchemaSelector';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;
const Container = styled.div`
  max-width: 1200px;
`;

interface MailMergeFormControlProps {
  template: string;
  onTemplateChanged: (t: string) => void;
}

const defaultNctId = 'NCT00222898';
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
  const [nctId, setNctId] = useState(defaultNctId);
  const [fragment, setFragment] = useState('');
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );
  const fragmentName = 'form_fragment';
  const { data: study } = useQuery(getQuery(fragmentName, fragment), {
    variables: { nctId: nctId },
  });

  if (!introspection) {
    return <Spinner />;
  }

  const schema: GraphqlSchemaType = {
    kind: 'graphql',
    typeName: 'Study',
    types: introspection.__schema.types,
  };

  return (
    <Container>
      <StyledFormControl
        placeholder={defaultNctId}
        value={nctId}
        onChange={e => setNctId(e.target.value || defaultNctId)}
      />
      <MailMerge
        schema={schema}
        sample={study?.study || {}}
        template={props.template}
        onTemplateChanged={props.onTemplateChanged}
        fragmentName={fragmentName}
        fragmentClass="Study"
        onFragmentChanged={setFragment}
      />
      {/* <CollapsiblePanel></CollapsiblePanel> */}
    </Container>
  );
}
