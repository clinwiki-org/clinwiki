import React, { useState } from 'react';
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import MailMerge from './MailMerge';

const getQuery = frag => gql`
  query SampleStudyQuery($nctId: String!) {
    study(nctId: $nctId) {
      briefTitle
      reviews {
        content
        user {
          email
        }
      }
    }
  }
`;

export default function TestComponent() {
  const [template, setTemplate] = useState(`
# title: {{briefTitle}}
{{#each reviews}}
Review:
  {{content}}
  - {{user.email}}
{{/each}}
`);
  const [fragment,setFragment] = useState('');
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );
  const { data: study } = useQuery(getQuery(fragment), {
    variables: { nctId: 'NCT03847779' },
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
          {JSON.stringify(study?.study, null, 2)}
        </pre>
        <pre>
          {JSON.stringify(fragment, null, 2)}
        </pre>
      </div>
    );
  }
  return <div>?</div>;
}
