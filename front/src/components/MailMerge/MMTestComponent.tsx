import React, { useState } from 'react';
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import MailMerge from './MailMerge';

const getQuery = frag => gql`
  query SampleStudyQuery($nctId: String!) {
    study(nctId: $nctId) {
      briefTitle
      ${frag}
    }
  }
`;

export default function TestComponent() {
  const [template, setTemplate] = useState('{{briefTitle}}');
  const [fragment,setFragment] = useState('');
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );
  const { data: study } = useQuery(getQuery(fragment), {
    variables: { nctId: 'NCT00001154' },
  });

  if (introspection) {
    const types = introspection.__schema.types;
    return (
      <div>
        <MailMerge
          schema={{ kind: 'graphql', name: 'Study', types }}
          sample={study?.study || {}}
          template={template}
          onTemplateChanged={setTemplate}
          onFragmentChanged={setFragment}
        />
        <pre>
          {JSON.stringify(
            types.filter(t => t.name == 'Study'),
            null,
            2
          )}
        </pre>
      </div>
    );
  }
  return <div>?</div>;
}
