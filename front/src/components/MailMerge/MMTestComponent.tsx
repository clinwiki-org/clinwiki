import React, { useState } from 'react';
import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import MailMerge from './MailMerge';
import { FormControl } from 'react-bootstrap';
import { getStudyQuery } from './MailMergeUtils';
import ReactDOMServer from 'react-dom/server'
import { pageIslands } from 'containers/Islands/CommonIslands'

import CollapsiblePanel from 'components/CollapsiblePanel';

export default function TestComponent() {
  const [template, setTemplate] = useState(`
# title: {{briefTitle}}
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

## NOTE:
If you use a self closing tag &lt;Workflow /> it will 'hide' the rest of the content.
Instead always supply a separate closing tag: &lt;Werkflow>&lt;/Werkflow>

<a href="/mmtest?hash=w2u8cgR2">Add search hash </a>

<Workflow name=WF_covid1></Workflow>


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
    ... pageIslands,
    groot: (attributes: Record<string,string>) => {
      return <img src="https://media.giphy.com/media/11vDNL1PrUUo0/source.gif" />;
    },
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
