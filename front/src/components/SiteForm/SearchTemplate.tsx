import React, { useState }from 'react';
import { FormControl } from 'react-bootstrap';
// import { useQuery } from 'react-apollo';
// import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import { BeatLoader } from 'react-spinners';
import MailMerge from '../MailMerge/MailMerge';
import { GraphqlSchemaType } from '../MailMerge/SchemaSelector';
import { fromPairs } from 'ramda';
import { PREFETCH_QUERY } from 'containers/StudyPage/StudyPage';
import { useQuery, gql} from '@apollo/client';
import { SchemaType } from 'components/MailMerge/SchemaSelector';
import { StudyPagePrefetchQuery } from 'types/StudyPagePrefetchQuery';
import { camelCase } from 'utils/helpers';
import { useFragment } from '../MailMerge/MailMergeFragment'
import { getStudyQuery, getSearchQuery } from '../MailMerge/MailMergeUtils';

interface Props {
  template: string;
  onTemplateChanged: (template: string) => void;
  fields: string[];
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

const Container = styled.div`
  max-width: 1200px;
`;

const default_nctid = 'NCT00222898';

function SearchTemplate(props: Props) {
  const [nctId, setNctId] = useState(default_nctid);
  const [fragmentState, setFragment] = useState('');
  const { data: introspection } = useQuery<IntrospectionQuery>(
    gql(getIntrospectionQuery({ descriptions: false }))
  );
  const [fragmentName, fragment] = useFragment('Study', props.template);
  const { data: study } = useQuery(getStudyQuery(fragmentName, fragment), {
    variables: { 
      nctId: nctId
     },
  });
  if (!introspection) {
    return <BeatLoader />;
  }
  const types = introspection.__schema.types;
  return (
    <Container>
      <StyledFormControl
        placeholder={default_nctid}
        value={nctId}
        onChange={e => setNctId(e.target.value || default_nctid)}
      />
      <MailMerge
        schema={{ kind: 'graphql', typeName: 'Study', types }}
        sample={study?.study || {}}
        template={props.template}
        onTemplateChanged={props.onTemplateChanged}
      />
    </Container>
  );
}

export default SearchTemplate;
