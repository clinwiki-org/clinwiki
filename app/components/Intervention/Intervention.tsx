import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { Row, Col, Grid } from 'react-bootstrap';
import { InterventionFragment } from 'types/InterventionFragment';
import { capitalize } from 'utils/helpers';

const StyleWrapper = styled.div`
  padding: 10px;
`;

interface InterventionProps {
  intervention: InterventionFragment;
}

class Intervention extends React.PureComponent<InterventionProps> {
  static fragment = gql`
    fragment InterventionFragment on Intervention {
      id
      description
      name
      type
      wikipediaArticle {
        id
        title
        description
        url
      }
    }
  `;

  render() {
    const { name, description, type: kind, wikipediaArticle } = this.props.intervention;
    return (
      <StyleWrapper>
        <Grid>
          <Row>
            <Col md={6}>
              <h1>{`${capitalize(name)} (${kind})`}</h1>
              {description && <div>{description}</div>}
              <h4>Wikipedia entry for <a href={wikipediaArticle.url} target="_blank">
                  {wikipediaArticle.title}
                </a>
              </h4>
              <div>{wikipediaArticle.description}</div>
            </Col>
          </Row>
        </Grid>
      </StyleWrapper>
    );
  }
}

export default Intervention;
