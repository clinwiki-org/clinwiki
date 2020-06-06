import * as React from 'react';
import { MailMergeEditor } from 'components/MailMerge';
import { searchSchema } from 'components/MailMerge/StudySchema';
import styled from 'styled-components';
import { FormControl } from 'react-bootstrap';

import {
  PREFETCH_QUERY,
  PrefetchQueryComponent,
} from 'containers/StudyPage/StudyPage';

interface Props {
  template: string;
  onTemplateChanged: (template: string) => void;
}

interface State {
  nct_id: string;
}

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
`;

const Container = styled.div`
  max-width: 1200px;
`;

const default_nctid = 'NCT00222898';

class SearchTemplate extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { nct_id: default_nctid };
  }
  updateSample = (e: any) => {
    this.setState({ nct_id: e.target.value || default_nctid });
  };
  render() {
    return (
      <PrefetchQueryComponent
        query={PREFETCH_QUERY}
        variables={{ nctId: this.state.nct_id }}>
        {({ data }) => (
          <Container>
            <StyledFormControl
              placeholder={default_nctid}
              value={this.state.nct_id}
              onChange={this.updateSample}
            />
            <MailMergeEditor
              schema={searchSchema}
              template={this.props.template || ''}
              sample={data?.study || {}}
              onTemplateChanged={this.props.onTemplateChanged}
            />
          </Container>
        )}
      </PrefetchQueryComponent>
    );
  }
}

export default SearchTemplate;
