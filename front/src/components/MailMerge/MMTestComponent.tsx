import React, { useState } from 'react';
import {
  getIntrospectionQuery,
  IntrospectionQuery,
  DocumentNode,
} from 'graphql';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import MailMerge from './MailMerge';
import { FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import { getStudyQuery, getSearchQuery } from './MailMergeUtils';
import { commonIslands } from 'containers/Islands/CommonIslands';
import { useFragment } from './MailMergeFragment';

type Mode = 'Study' | 'Search';

// return a tuple of the elements that differ with the mode
// query, params, schema

function getClassForMode(mode: Mode) {
  switch (mode) {
    case 'Study':
      return 'Study';
    case 'Search':
      return 'ElasticStudy';
  }
}

function getModeData(
  mode: Mode,
  arg: string,
  fragment: string,
  fragmentName: string
): [DocumentNode, object, string] {
  switch (mode) {
    case 'Study':
      return [getStudyQuery(fragmentName, fragment), { nctId: arg }, 'Study'];
    case 'Search':
      return [
        getSearchQuery(fragmentName, fragment),
        { hash: arg },
        'ElasticStudy',
      ];
  }
}

export default function TestComponent() {
  const [template, setTemplate] = useState(`
# title: {{briefTitle}}
<Expander header="outter">
  <table class="table table-striped table-bordered table-condensed">
    <tbody>
      <tr> <th>NCT ID</th> <td>{{nctId}}</td> </tr>
      <tr> <th>Overall Status</th> <td>{{overallStatus}}</td> </tr>
      <tr> <th>Completion Date</th> <td>{{completionDate}}</td> </tr>
      <tr> <th>Enrollment</th> <td>{{enrollment}}</td> </tr>
      <tr> <th>Source</th> <td>{{source}}</td> </tr>
    </tbody>
  </table>
  <Expander header=details collapsed=true>
    <Groot></Groot>
  </Expander>
</Expander>
`);
  const [mode, setMode] = useState<Mode>('Study');
  const defaultNctId = 'NCT03847779';
  const defaultSearchHash = 'tqxCyI9M';
  let [nctOrSearchHash, setNctOrSearchHash] = useState(defaultNctId);

  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );

  const schemaType = getClassForMode(mode);
  const [fragmentName, fragment] = useFragment(schemaType, template);
  const [query, variables] = getModeData(mode, nctOrSearchHash, fragment, fragmentName);
  const { data } = useQuery(query, { variables });

  const updateMode = mode => {
    setMode(mode);
    if (mode === 'Study') setNctOrSearchHash(defaultNctId);
    if (mode === 'Search') setNctOrSearchHash(defaultSearchHash);
  };

  const islands = {
    ...commonIslands,
    groot: (attributes: Record<string, string>) => {
      return (
        <img src="https://media.giphy.com/media/11vDNL1PrUUo0/source.gif" />
      );
    },
  };

  const sampleData = data?.study || data?.search?.studies?.[0];

  if (introspection) {
    const types = introspection.__schema.types;
    return (
      <div>
        <DropdownButton
          bsStyle="default"
          title={`Type: ${mode}`}
          key={mode}
          style={{ marginBottom: '10px' }}>
          <MenuItem onClick={_ => updateMode('Study')}>Study</MenuItem>
          <MenuItem onClick={_ => updateMode('Search')}>Search</MenuItem>
        </DropdownButton>
        <FormControl
          placeholder="Select an nctid"
          value={nctOrSearchHash}
          onChange={e => setNctOrSearchHash(e.target.value || defaultNctId)}
        />
        <MailMerge
          schema={{ kind: 'graphql', typeName: schemaType, types }}
          sample={data?.study || data?.search?.studies?.[0]}
          template={template}
          onTemplateChanged={setTemplate}
          islands={islands}
        />
        <pre>{fragment}</pre>
        <pre>
          {JSON.stringify(data?.study || data?.search?.studies, null, 2)}
        </pre>
      </div>
    );
  }
  return <div>?</div>;
}
