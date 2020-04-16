import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { WikiPageEditFragment } from 'types/WikiPageEditFragment';
import EditBlurb from './EditBlurb';
import ExpandedEdit from './ExpandedEdit';

interface EditProps {
  edit: WikiPageEditFragment;
}

interface EditState {
  expanded: boolean;
}

class Edit extends React.Component<EditProps, EditState> {
  state = {
    expanded: false,
  };

  setExpanded = expanded => this.setState({ ...this.state, expanded });

  render() {
    const { edit } = this.props;
    const { expanded } = this.state;
    return (
      <tr key={edit.id} style={{ padding: '10px' }}>
        <td>
          <EditBlurb
            edit={edit}
            expanded={expanded}
            setExpanded={this.setExpanded}
          />
          {expanded && (
            <Row style={{ padding: '10px', marginBottom: '10px' }}>
              <Col md={12}>
                <ExpandedEdit edit={edit} />
              </Col>
            </Row>
          )}
        </td>
      </tr>
    );
  }
}

export default Edit;
