import * as React from 'react';
import styled from 'styled-components';
import { Mutation, Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import { Grid, Table } from 'react-bootstrap';
import Helmet from 'react-helmet';

import LoadingPane from 'components/LoadingPane';
import Error from 'components/Error';
import Edits from 'components/Edits';
import StudySummary from 'components/StudySummary';
import ButtonCell from './ButtonCell';

import {
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables,
} from 'types/CrowdPageUpsertWikiLabelMutation';
import {
  CrowdPageDeleteWikiLabelMutation,
  CrowdPageDeleteWikiLabelMutationVariables,
} from 'types/CrowdPageDeleteWikiLabelMutation';
import { CrowdPageQuery, CrowdPageQueryVariables } from 'types/CrowdPageQuery';

import { WikiPageEditFragment } from 'types/WikiPageEditFragment';
import WikiPage from 'containers/WikiPage';
import {
  keys,
  pipe,
  flatten,
  map,
  split,
  findIndex,
  equals,
  uniq,
} from 'ramda';
import CrowdLabel from './CrowdLabel';
import AddCrowdLabel from './AddCrowdLabel';

interface CrowdProps {
  match: match<{ nctId: string }>;
  history: History;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

interface CrowdState {
  forceAddKey: string | null;
}

const FRAGMENT = gql`
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;

const QUERY = gql`
  query CrowdPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      wikiPage {
        ...CrowdPageFragment
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

const UPSERT_LABEL_MUTATION = gql`
  mutation CrowdPageUpsertWikiLabelMutation(
    $nctId: String!
    $key: String!
    $value: String!
  ) {
    upsertWikiLabel(input: { nctId: $nctId, key: $key, value: $value }) {
      wikiPage {
        ...WikiPageFragment
      }
      errors
    }
  }

  ${WikiPage.fragment}
`;

const DELETE_LABEL_MUTATION = gql`
  mutation CrowdPageDeleteWikiLabelMutation($nctId: String!, $key: String!) {
    deleteWikiLabel(input: { nctId: $nctId, key: $key }) {
      wikiPage {
        ...WikiPageFragment
      }
      errors
    }
  }

  ${WikiPage.fragment}
`;

const TableWrapper = styled(Table)`
  td {
    vertical-align: middle !important;
  }
`;

class UpsertMutationComponent extends Mutation<
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables
> {}

class DeleteMutationComponent extends Mutation<
  CrowdPageDeleteWikiLabelMutation,
  CrowdPageDeleteWikiLabelMutationVariables
> {}

class QueryComponent extends Query<CrowdPageQuery, CrowdPageQueryVariables> {}

class Crowd extends React.Component<CrowdProps, CrowdState> {
  state: CrowdState = {
    forceAddKey: null,
  };

  static fragment = FRAGMENT;

  handleLabelSumbit = (
    meta: {},
    upsertLabelMutation: (x: {
      variables: CrowdPageUpsertWikiLabelMutationVariables;
    }) => void,
  ) => (key: string, oldValue: string, value: string) => {
    if (!value) return;
    const currentValue = meta[key];
    if (currentValue == null) return;

    const parts = currentValue.split('|');
    const idx = findIndex(equals(oldValue), parts);
    if (idx === -1) return;

    parts[idx] = value;
    const newValue = uniq(parts).join('|');

    upsertLabelMutation({
      variables: { key, value: newValue, nctId: this.props.match.params.nctId },
    });
  };

  handleLabelDelete = (
    meta: {},
    upsertLabelMutation: (x: {
      variables: CrowdPageUpsertWikiLabelMutationVariables;
    }) => void,
    deleteLabelMutation: (x: {
      variables: CrowdPageDeleteWikiLabelMutationVariables;
    }) => void,
  ) => (key: string, value: string) => {
    const currentValue = meta[key];
    if (!currentValue) return null;

    const newValue = uniq(
      currentValue.split('|').filter(x => x !== value),
    ).join('|');
    if (newValue.length === 0) {
      deleteLabelMutation({
        variables: { key, nctId: this.props.match.params.nctId },
      });
    } else {
      upsertLabelMutation({
        variables: {
          key,
          value: newValue,
          nctId: this.props.match.params.nctId,
        },
      });
    }
  };

  handleAddLabel = (
    key: string,
    value: string,
    meta: {},
    upsertLabelMutation: (x: {
      variables: CrowdPageUpsertWikiLabelMutationVariables;
    }) => void,
  ) => {
    if (!value) return;
    let val = value;
    if (meta[key]) {
      const oldVal = meta[key];
      const entries = oldVal.split('|').filter(x => x !== val);
      entries.push(value);
      val = uniq(entries).join('|');
    }
    upsertLabelMutation({
      variables: { key, value: val, nctId: this.props.match.params.nctId },
    });

    this.setState({ forceAddKey: null });
  };

  handleAddInsideLabelClick = (key: string) => {
    this.setState({ forceAddKey: key });
  };

  handleLoaded = () => {
    this.props.onLoaded && this.props.onLoaded();
  };

  renderLabels = (
    meta: {},
    upsertLabelMutation: (x: {
      variables: CrowdPageUpsertWikiLabelMutationVariables;
    }) => void,
    deleteLabelMutation: (x: {
      variables: CrowdPageDeleteWikiLabelMutationVariables;
    }) => void,
  ) => {
    const labels = pipe(
      keys,
      map(key =>
        (meta[key] as string).split('|').map(value => ({ key, value })),
      ),
      // @ts-ignore
      flatten,
    )(meta);
    return (
      <div>
        <Helmet>
          <title>Crowd Annotations</title>
        </Helmet>
        <TableWrapper striped condensed bordered>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Label</th>
              <th style={{ width: '50%', borderRight: 'none' }}>Description</th>
              <th
                style={{
                  width: '10%',
                  borderLeft: 'none',
                  borderRight: 'none',
                }}
              />
              <th
                style={{
                  width: '10%',
                  borderLeft: 'none',
                  borderRight: 'none',
                }}
              />
              <th
                style={{
                  width: '10%',
                  borderLeft: 'none',
                  borderRight: 'none',
                }}
              />
            </tr>
          </thead>
          <tbody>
            {labels.map(label => (
              <CrowdLabel
                key={`${label.key} - ${label.value}`}
                name={label.key}
                value={label.value}
                onSubmitClick={this.handleLabelSumbit(
                  meta,
                  upsertLabelMutation,
                )}
                onDeleteClick={this.handleLabelDelete(
                  meta,
                  upsertLabelMutation,
                  deleteLabelMutation,
                )}
                onAddClick={this.handleAddInsideLabelClick}
              />
            ))}
            <AddCrowdLabel
              onAddLabel={(key, value) =>
                this.handleAddLabel(key, value, meta, upsertLabelMutation)
              }
              forceAddKey={this.state.forceAddKey}
            />
          </tbody>
        </TableWrapper>
      </div>
    );
  };

  render() {
    return (
      <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
        {upsertLabelMutation => (
          <DeleteMutationComponent mutation={DELETE_LABEL_MUTATION}>
            {deleteLabelMutation => (
              <QueryComponent
                query={QUERY}
                variables={{ nctId: this.props.match.params.nctId }}
              >
                {({ data, loading, error }) => {
                  if (loading) {
                    return <LoadingPane />;
                  }
                  if (error) {
                    return <Error message={error.message} />;
                  }
                  this.handleLoaded();
                  if (!data || !data.study || !data.study.wikiPage) return null;
                  let meta: {};
                  try {
                    meta = JSON.parse(data.study.wikiPage.meta || '{}');
                  } catch (e) {
                    console.error(
                      `Error on parsing meta '${
                        data.study.wikiPage.meta
                      }' for nctId: ${this.props.match.params.nctId}`,
                      e,
                    );
                    return null;
                  }
                  return this.renderLabels(
                    meta,
                    upsertLabelMutation,
                    deleteLabelMutation,
                  );
                }}
              </QueryComponent>
            )}
          </DeleteMutationComponent>
        )}
      </UpsertMutationComponent>
    );
  }
}

export default Crowd;
