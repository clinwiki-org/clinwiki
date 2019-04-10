import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  TrackingPageQuery,
  TrackingPageQueryVariables,
} from 'types/TrackingPageQuery';
import StudySummary from 'components/StudySummary';
import { pipe, filter, prop, propEq, map, join } from 'ramda';

interface TrackingPageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

const FRAGMENT = gql`
  fragment TrackingInfoFragment on TrackingInfo {
    designOutcomes {
      description
      measure
      nctId
      outcomeType
    }
    firstReceivedDate
    lastChangedDate
    primaryCompletionDate
    startDate
  }
`;

const QUERY = gql`
  query TrackingPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      trackingInfo {
        ...TrackingInfoFragment
      }
      nctId
    }
    me {
      id
    }
  }

  ${StudySummary.fragment}
  ${FRAGMENT}
`;

class QueryComponent extends Query<
  TrackingPageQuery,
  TrackingPageQueryVariables
> {}

class TrackingPage extends React.PureComponent<TrackingPageProps> {
  static fragment = FRAGMENT;

  renderItem = (key: string, value: string | null) => {
    return (
      <tr key={key}>
        <td style={{ width: '30%', verticalAlign: 'middle' }}>
          <b>{key}</b>
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
          if (
            loading ||
            error ||
            !data ||
            !data.study ||
            !data.study.trackingInfo
          ) {
            return null;
          }

          this.props.onLoaded && this.props.onLoaded();
          const info = data.study.trackingInfo;
          const getMeasures = (kind: string): string =>
            pipe(
              prop('designOutcomes'),
              filter(propEq('outcomeType', 'primary')),
              map(prop('measure')),
              // @ts-ignore
              join(' | '),
            )(info);
          const primaryMeasures = getMeasures('primary');
          const secondaryMeasures = getMeasures('secondary');
          return (
            <Table striped bordered condensed>
              <tbody>
                {this.renderItem('First Received Date', info.firstReceivedDate)}
                {this.renderItem('Last Changed Date', info.lastChangedDate)}
                {this.renderItem('Start Date', info.startDate)}
                {this.renderItem(
                  'Primary Completion Date',
                  info.primaryCompletionDate,
                )}
                {this.renderItem('Primary Outcome Measures', primaryMeasures)}
                {this.renderItem(
                  'Secondary Outcome Measures',
                  secondaryMeasures,
                )}
              </tbody>
            </Table>
          );
        }}
      </QueryComponent>
    );
  }
}

export default TrackingPage;
