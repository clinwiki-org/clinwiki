import * as React from 'react';
import styled from 'styled-components';
import { WikiPageQuery } from 'types/WikiPageQuery';
import { Row, Col, Table } from 'react-bootstrap';
import {
  WikiPageEditFragment,
  WikiPageEditFragment_user,
} from 'types/WikiPageEditFragment';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';

interface EditsProps {
  edits: WikiPageEditFragment[];
}

// these are the styles provided by diffy, btw
const StyleWrapper = styled(Table)`
  .diff {
    overflow: auto;
  }
  .diff ul {
    background: none;
    overflow: auto;
    font-size: 13px;
    list-style: none;
    margin: 0;
    padding: 0;
    display: table;
    width: 100%;
  }
  .diff del,
  .diff ins {
    display: block;
    text-decoration: none;
  }
  .diff li {
    padding: 0;
    display: table-row;
    margin: 0;
    height: 1em;
  }
  .diff li.ins {
    background: #dfd;
    color: #080;
  }
  .diff li.del {
    background: #fee;
    color: #b00;
  }
  .diff li:hover {
    background: #ffc;
  }
  /* try 'whitespace:pre;' if you don't want lines to wrap */
  .diff del,
  .diff ins,
  .diff span {
    white-space: pre-wrap;
    font-family: courier;
  }
  .diff del strong {
    font-weight: normal;
    background: #fcc;
  }
  .diff ins strong {
    font-weight: normal;
    background: #9f9;
  }
  .diff li.diff-comment {
    display: none;
  }
  .diff li.diff-block-info {
    background: none repeat scroll 0 0 gray;
  }
`;

class Edits extends React.PureComponent<EditsProps> {
  static fragment = gql`
    fragment WikiPageEditFragment on WikiPageEdit {
      user {
        id
        firstName
        lastName
        email
      }
      createdAt
      id
      comment
      diff
      diffHtml
    }
  `;

  //Links added here, user id passed in here
  getName = (user: WikiPageEditFragment_user | null) => {
    if (!user) return 'Anonymous';
    if (user.firstName) {
      const userName = (
        <Link to={`profile/${user.id}`}>
          `${user.firstName} ${user.lastName && user.lastName[0]}`
        </Link>
      );
      return userName;
    }
    const userName = <Link to={`profile/${user.id}`}>{user.email}</Link>;
    return userName;
  };

  render() {
    console.log(this.props.edits, 'edits');
    return (
      <StyleWrapper striped bordered>
        <tbody>
          {this.props.edits.map(edit => (
            <tr key={edit.id} style={{ padding: '10px' }}>
              <td>
                <Row style={{ marginBottom: '10px', padding: '10px' }}>
                  <Col md={6}>
                    <b>{this.getName(edit.user)}</b>
                    <br />
                  </Col>
                  <Col md={4}>{edit.comment}</Col>
                  <Col md={2} className="text-right">
                    <small>
                      {new Date(edit.createdAt).toLocaleDateString('en-US')}
                    </small>
                  </Col>
                </Row>
                <Row style={{ padding: '10px', marginBottom: '10px' }}>
                  <Col md={12}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: edit.diffHtml || '<p></p>',
                      }}
                    />
                  </Col>
                </Row>
              </td>
            </tr>
          ))}
        </tbody>
      </StyleWrapper>
    );
  }
}

export default Edits;
