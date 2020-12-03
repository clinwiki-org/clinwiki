import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { InterventionFragment } from 'types/InterventionFragment';
import { capitalize } from 'utils/helpers';
import withTheme from '../../containers/ThemeProvider';

const StyleWrapper = styled.div`
  padding: 10px;
  // color: white;
  background: #eaedf4;
  border-radius: 2px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ThemedStyleWrapper = withTheme(StyleWrapper);

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

  renderInterventionText(name, wikipediaArticle) {
    if (wikipediaArticle) {
      return (
        <div>
          <h4>
            Wikipedia entry for{' '}
            <a href={wikipediaArticle.url} target="_blank" rel="noopener noreferrer">
              {wikipediaArticle.title}
            </a>
          </h4>
          <div>{wikipediaArticle.description}</div>
        </div>
      );
    }

    return (
      <p>
        <a href={`https://en.wikipedia.org/wiki/${name}`} target="_blank" rel="noopener noreferrer">
          View on Wikipedia
        </a>
      </p>
    );
  }

  render() {
    const {
      name,
      description,
      type: kind,
      wikipediaArticle,
    } = this.props.intervention;
    return (
      <ThemedStyleWrapper>
        <Row>
          <Col md={12}>
            <h1>{`${capitalize(name || 'No name')} (${kind})`}</h1>
            {description && <p>{description}</p>}
            {this.renderInterventionText(name, wikipediaArticle)}
          </Col>
        </Row>
      </ThemedStyleWrapper>
    );
  }
}

export default Intervention;
