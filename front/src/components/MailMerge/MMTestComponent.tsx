import React, { useState } from 'react';
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import MailMerge from './MailMerge';
import { FormControl } from 'react-bootstrap';
import { getStudyQuery } from './MailMergeUtils';

import CollapsiblePanel from 'components/CollapsiblePanel';

export default function TestComponent() {
  const [template, setTemplate] = useState(`
# title: {{briefTitle}}
<Panel>
<table class="table table-striped table-bordered table-condensed">
  <tbody>
    <tr> <th>NCT ID</th> <td>{{nctId}}</td> </tr>
    <tr> <th>type</th> <td>{{type}}</td> </tr>
    <tr> <th>Overall Status</th> <td>{{overallStatus}}</td> </tr>
    <tr> <th>Completion Date</th> <td>{{completionDate}}</td> </tr>
    <tr> <th>Enrollment</th> <td>{{enrollment}}</td> </tr>
    <tr> <th>Source</th> <td>{{source}}</td> </tr>
  </tbody>
</table>
</Panel>

<Groot>

`);
  const [fragment, setFragment] = useState('');
  const defaultNctId = 'NCT03847779';
  const [nctId, setNctId] = useState(defaultNctId);
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );
  const fragmentName = 'demo_fragment';
  const { data: study } = useQuery(getStudyQuery(fragmentName, fragment), {
    variables: { nctId: nctId },
  });

  const islands = {
    Groot: (parent: Element, context: object) => {
      console.log(parent);
      return <img src="https://media.giphy.com/media/11vDNL1PrUUo0/source.gif" />;
    },
    // Panel: (parent: Element, context: object) => {
    //   return <CollapsiblePanel header={parent.attributes['header']}>
    //     <div dangerouslySetInnerHTML={{ __html: parent.innerHTML }} />
    //   </CollapsiblePanel>
    // },
  };

  if (introspection) {
    const types = introspection.__schema.types;
    return (
      <div>
        <FormControl
          placeholder="Select an nctid"
          value={nctId}
          onChange={e => setNctId(e.target.value || defaultNctId)}
        />
        <MailMerge
          schema={{ kind: 'graphql', typeName: 'Study', types }}
          sample={study?.study}
          template={template}
          onTemplateChanged={setTemplate}
          fragmentName={fragmentName}
          fragmentClass="Study"
          onFragmentChanged={setFragment}
          islands={islands}
        />
        <pre>{fragment}</pre>
        <pre>{JSON.stringify(study?.study, null, 2)}</pre>
      </div>
    );
  }
  return <div>?</div>;
}
