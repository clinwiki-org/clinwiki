import React, { useState } from 'react';
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import MailMerge from './MailMerge';

const getQuery = (name,frag) => gql`
  query SampleStudyQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...${name}
    }
  }
  ${frag}
`;

export default function TestComponent() {
  const [template, setTemplate] = useState(`
# title: {{briefTitle}}
{{#each reviews}}
- Review: {{content}}
  - {{user.email}}

{{#with user}}
  - {{email}}
{{/with}}
{{/each}}

Facility contacts:  
{{#each facilities}}
 {{#each contacts}}
  {{name}}  
 {{/each}}
 {{location.latitude}}
 {{location.longitude}}
{{/each}}
`);
  const [fragment, setFragment] = useState('');
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );
  const fragmentName = "demo_fragment";
  const query = getQuery(fragmentName, fragment);
  console.log(query);
  const { data: study } = useQuery(query, {
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
          fragmentName={fragmentName}
          fragmentClass="Study"
          onFragmentChanged={setFragment}
        />
        <pre>{fragment}</pre>
        <pre>{JSON.stringify(study?.study, null, 2)}</pre>
      </div>
    );
  }
  return <div>?</div>;
}
