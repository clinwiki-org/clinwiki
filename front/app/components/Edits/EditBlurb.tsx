import * as React from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import {
  WikiPageEditFragment,
  WikiPageEditFragment_user,
} from 'types/WikiPageEditFragment';
import { Link } from 'react-router-dom';
import ThemedButton from 'components/StyledComponents';

interface EditBlurbProps {
  edit: WikiPageEditFragment;
  expanded: boolean;
  setExpanded: any;
}

class EditBlurb extends React.Component<EditBlurbProps> {
  getUserIdentity() {
    const {
      edit: { user },
    } = this.props;
    if (!user) {
      return 'Anonymous';
    }
    if (user.firstName) {
      const userName = `${user.firstName} ${user.lastName && user.lastName[0]}`;
      return <Link to={`/profile/${user.id}?sv=user`}>`${userName}`</Link>;
    }
    return <Link to={`/profile/${user.id}?sv=user`}>{user.email}</Link>;
  }

  getBlurb() {
    const {
      edit: {
        changeSet: { bodyChanged, frontMatterChanged },
      },
    } = this.props;
    if (!bodyChanged && !frontMatterChanged) {
      return 'made the first edit.';
    }
    if (frontMatterChanged) {
      return 'made a crowd data change.';
    }
    if (bodyChanged) {
      return 'updated the wiki.';
    }
    return 'made a change.';
  }

  render() {
    const { edit, expanded, setExpanded } = this.props;
    return (
      <Row style={{ marginBottom: '10px', padding: '10px' }}>
        <Col md={8}>
          <span className="diff-actor">{this.getUserIdentity()}</span>
          <span>{' ' + this.getBlurb()}</span>
        </Col>
        <Col md={2}>
          <small>{new Date(edit.createdAt).toLocaleDateString('en-US')}</small>
        </Col>
        <Col md={2} className="text-right">
          {expanded && (
            <ThemedButton onClick={() => setExpanded(false)}>
              View Less
            </ThemedButton>
          )}
          {!expanded && (
            <ThemedButton onClick={() => setExpanded(true)}>
              View More
            </ThemedButton>
          )}
        </Col>
      </Row>
    );
  }
}

export default EditBlurb;
