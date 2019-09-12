import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  GenericStudySectionPageQuery,
  GenericStudySectionPageQueryVariables,
} from 'types/GenericStudySectionPageQuery';
import StudySummary from 'components/StudySummary';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { prop, pipe, split, map, join } from 'ramda';
import { snakeCase, capitalize } from 'utils/helpers';

interface GenericStudySectionPageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
}

const QUERY = gql`
  query GenericStudySectionPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
    }
    me {
      id
    }
  }

  ${StudySummary.fragment}
`;

class QueryComponent extends Query<
  GenericStudySectionPageQuery,
  GenericStudySectionPageQueryVariables
> {}

class GenericStudySectionPage extends React.PureComponent<
  GenericStudySectionPageProps
> {
  renderItem = (key: string, value: string | null) => {
    const name = pipe(
      snakeCase,
      split('_'),
      map(capitalize),
      join(' '),
    )(key);
    return (
      <tr key={key}>
        <td style={{ width: '30%', verticalAlign: 'middle' }}>
          <b>{name}</b>
        </td>
        <td>{value || ''}</td>
      </tr>
    );
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}
      >
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.study) {
            return null;
          }
          const fields = displayFields(
            this.props.metaData.selected.kind,
            this.props.metaData.selected.values,
            this.props.metaData.fields.map(name => ({ name, rank: null })),
            true,
          ).map(prop('name'));

          this.props.onLoaded && this.props.onLoaded();
          return (
            <Table striped bordered condensed>
              <tbody>
                {fields.map(field =>
                  this.renderItem(field, data.study![field]),
                )}
              </tbody>
            </Table>
          );
        }}
      </QueryComponent>
    );
  }
}

export default GenericStudySectionPage;
