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
import { pageIslands } from 'containers/Islands/CommonIslands';

type Mode = 'Study' | 'Search';

const fragmentName = 'demo_fragment';

// return a tuple of the elements that differ with the mode
// query, params, schema
function getModeData(
  mode: Mode,
  arg: string,
  fragment: string
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


`);
  const [fragment, setFragment] = useState('');
  const [mode, setMode] = useState<Mode>('Study');
  const defaultNctId = 'NCT03847779';
  const defaultSearchHash = 'tqxCyI9M';
  const [nctOrSearchHash, setNctOrSearchHash] = useState(defaultNctId);
  if (nctOrSearchHash === defaultNctId && mode == 'Search') {
    setNctOrSearchHash(defaultSearchHash);
  }
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );

  const [query, variables, schemaType] = getModeData(
    mode,
    nctOrSearchHash,
    fragment
  );

  const { data } = useQuery(query, { variables });

  const islands = {
    ...pageIslands,
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
          <MenuItem onClick={_ => setMode('Study')}>Study</MenuItem>
          <MenuItem onClick={_ => setMode('Search')}>Search</MenuItem>
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
          fragmentName={fragmentName}
          fragmentClass={schemaType}
          onFragmentChanged={setFragment}
          islands={islands}
        />
        <pre>{fragment}</pre>
        <pre>{JSON.stringify(data?.study || data?.search?.studies, null, 2)}</pre>
      </div>
    );
  }
  return <div>?</div>;
}
