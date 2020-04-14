import * as React from "react";
import { Row, Col, Table, Button } from 'react-bootstrap';
import {
  WikiPageEditFragment,
  WikiPageEditFragment_user
} from 'types/WikiPageEditFragment';

interface EditBlurbProps {
  edit: WikiPageEditFragment;
  expanded: boolean;
  setExpanded: any;
}

class EditBlurb extends React.Component<EditBlurbProps> {

  getUserIdentity() {
    const { edit: { user } } = this.props;
    if (!user) {
      return 'Anonymous';
    }
    if (user.firstName) {
      return `${user.firstName} ${user.lastName && user.lastName[0]}`;
    }
    return user.email;
  }

  getBlurb() {
    const { edit: { changeSet: { bodyChanged, frontMatterChanged } } } = this.props;
    if (bodyChanged && frontMatterChanged) {
      return "made the first edit."
    }
    if (frontMatterChanged) {
      return "made a crowd data change.";
    }
    return "updated the wiki."
  }

  render() {
    const { edit, expanded, setExpanded } = this.props;
    return (
      <Row style={{ marginBottom: '10px', padding: '10px' }}>
        <Col md={8}>
          <span className="diff-actor">
            {this.getUserIdentity()}
          </span>
          <span>
            {' ' + this.getBlurb()}
          </span>
        </Col>
        <Col md={2}>
          <small>
            {new Date(edit.createdAt).toLocaleDateString('en-US')}
          </small>
        </Col>
        <Col md={2} className="text-right">
          {expanded && (<Button onClick={() => setExpanded(false)}>View Less</Button>)}
          {!expanded && (<Button onClick={() => setExpanded(true)}>View More</Button>)}
        </Col>
      </Row>
    )
  }
}

export default EditBlurb;
