import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import {
  WikiPageEditFragment,
} from 'types/WikiPageEditFragment';
import { Link } from 'react-router-dom';
import ThemedButton from 'components/StyledComponents';

interface EditBlurbProps {
  edit: WikiPageEditFragment;
  expanded: boolean;
  setExpanded: any;
}

const EditBlurb = (props: EditBlurbProps) => {
  const getUserIdentity = () => {
    const {
      edit: { user },
    } = props;

    if (!user) {
      return 'Anonymous';
    }

    if (user.firstName) {
      const userName = `${user.firstName} ${user.lastName && user.lastName[0]}`;
      return (
        <Link
          to={`/profile/${user.email}?sv=user&uid=${user.id}&username=${userName}`}>
          `${userName}`
        </Link>
      );
    }

    return (
      <Link
        to={`/profile/${user.email}?sv=user&uid=${user.id}&username=${user.email}`}>
        {user.email}
      </Link>
    );
  }

  const getBlurb = () => {
    const {
      edit: {
        changeSet: { bodyChanged, frontMatterChanged },
      },
    } = props;
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

  const { edit, expanded, setExpanded } = props;

  return (
    <Row style={{ marginBottom: '10px', padding: '10px' }}>
      <Col md={8}>
        <span className="diff-actor">{getUserIdentity()}</span>
        <span>{' ' + getBlurb()}</span>
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

export default EditBlurb;
