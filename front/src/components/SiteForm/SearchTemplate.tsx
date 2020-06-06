import React, { useState } from 'react';
import { MailMergeEditor } from 'components/MailMerge';
import { searchSchema } from 'components/MailMerge/StudySchema';
import styled from 'styled-components';
import { FormControl } from 'react-bootstrap';

import {
  PREFETCH_QUERY,
} from 'containers/StudyPage/StudyPage';
import { useQuery } from 'react-apollo';

interface Props {
  template: string;
  onTemplateChanged: (template: string) => void;
  fields: { id: string; label: string }[];
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

const Container = styled.div`
  max-width: 1200px;
`;

const default_nctid = 'NCT00222898';

function SearchTemplate(props: Props) {
  const [nctID, setNctId] = useState(default_nctid);
  const { data } = useQuery(PREFETCH_QUERY, { variables: { nctID } });
  return (
    <Container>
      <StyledFormControl
        placeholder={default_nctid}
        value={nctID}
        onChange={e => setNctId(e.target.value || default_nctid)}
      />
      <MailMergeEditor
        schema={searchSchema}
        template={props.template || ''}
        sample={data?.study || {}}
        onTemplateChanged={props.onTemplateChanged}
      />
    </Container>
  );
}

export default SearchTemplate;
