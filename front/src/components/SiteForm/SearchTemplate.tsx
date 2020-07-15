import React, { useState, useMemo } from 'react';
import { MailMergeEditor } from 'components/MailMerge';
import styled from 'styled-components';
import { FormControl } from 'react-bootstrap';
import { fromPairs } from 'ramda';
import { PREFETCH_QUERY } from 'containers/StudyPage/StudyPage';
import { useQuery } from 'react-apollo';
import { SchemaType } from 'components/MailMerge/SchemaSelector';
import { StudyPagePrefetchQuery } from 'types/StudyPagePrefetchQuery';
import { camelCase } from 'utils/helpers';

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
  const { data } = useQuery<StudyPagePrefetchQuery>(PREFETCH_QUERY, {
    variables: { nctId },
  });
  const schema: SchemaType = useMemo(()=> ({
    kind: 'json',
    schema: {
      type: 'object',
      properties: fromPairs(
        props.fields.map(f => [camelCase(f), { type: 'string' }])
      )
    },
  }), [props.fields]);
  return (
    <Container>
      <StyledFormControl
        placeholder={default_nctid}
        value={nctId}
        onChange={e => setNctId(e.target.value || default_nctid)}
      />
      <MailMergeEditor
        schema={schema}
        template={props.template || ''}
        sample={data?.study || {}}
        onTemplateChanged={props.onTemplateChanged}
      />
    </Container>
  );
}

export default SearchTemplate;
