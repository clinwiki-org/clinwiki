import * as React from 'react';
import styled from 'styled-components';
import { WikiPageQuery } from 'types/WikiPageQuery';
import { Row, Col, Table } from 'react-bootstrap';
import {
  WikiPageEditFragment,
  WikiPageEditFragment_user,
} from 'types/WikiPageEditFragment';
import { gql } from 'apollo-boost';
import StyleWrapper from "./StyleWrapper";

interface EditsProps {
  edits: WikiPageEditFragment[];
}

class Edits extends React.PureComponent<EditsProps> {
  getName = (user: WikiPageEditFragment_user | null) => {
    if (!user) return 'Anonymous';
    if (user.firstName) {
      return `${user.firstName} ${user.lastName && user.lastName[0]}`;
    }
    return user.email;
  };

  render() {
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
