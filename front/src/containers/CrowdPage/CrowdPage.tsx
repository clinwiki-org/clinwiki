import * as React from 'react';
import styled from 'styled-components';
import {
  Query,
  QueryComponentOptions,
} from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import { Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import LoadingPane from 'components/LoadingPane';
import Error from 'components/Error';
import StudySummary from 'components/StudySummary';
import { DELETE_LABEL_MUTATION, FRAGMENT, DeleteMutationComponent, DeleteMutationFn } from 'mutations/CrowdPageDeleteWikiLabelMutation';

import {
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables,
} from 'types/CrowdPageUpsertWikiLabelMutation';
import { CrowdPageQuery, CrowdPageQueryVariables } from 'types/CrowdPageQuery';

import {
  keys,
  pipe,
  flatten,
  map,
  findIndex,
  equals,
  uniq,
  dissoc,
} from 'ramda';
import CrowdLabel from './CrowdLabel';
import AddCrowdLabel from './AddCrowdLabel';
import CurrentUser from 'containers/CurrentUser';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import {
  UPSERT_LABEL_MUTATION,
  UpsertMutationComponent,
  UpsertMutationFn,
} from 'mutations/CrowdPageUpsertWikiLabelMutation';

interface CrowdProps {
  nctId: string;
  match: match<{ nctId: string }>;
  history: History;
  onLoaded?: () => void;
  workflowView?: boolean;
  nextLink?: string | null;
  forceAddLabel?: { key: string; value: string };
  metaData: SiteStudyBasicGenericSectionFragment;
  showAnimation: any;
}

interface CrowdState {
  forceAddLabel: { key: string; value: string } | null;
  prevForceAddLabel: { key: string; value: string } | null;
}

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

const TableWrapper = styled(Table)`
  td {
    vertical-align: middle !important;
  }
`;

const QueryComponent = (
  props: QueryComponentOptions<CrowdPageQuery, CrowdPageQueryVariables>
) => Query(props);

class Crowd extends React.Component<CrowdProps, CrowdState> {
  state: CrowdState = {
    forceAddLabel: null,
    prevForceAddLabel: null,
  };

  static getDerivedStateFromProps(props: CrowdProps, state: CrowdState) {
    if (
      props.forceAddLabel &&
      !equals(props.forceAddLabel, state.prevForceAddLabel)
    ) {
      return {
        ...state,
        forceAddLabel: props.forceAddLabel,
        prevForceAddLabel: props.forceAddLabel,
      };
    }

    return null;
  }

  static fragment = FRAGMENT;

  static updateLabel = (
    key: string,
    oldValue: string,
    value: string,
    meta: {},
    nctId: string,
    upsertLabelMutation: (x: {
      variables: CrowdPageUpsertWikiLabelMutationVariables;
      optimisticResponse?: CrowdPageUpsertWikiLabelMutation;
    }) => void
  ) => {
    if (!value) return;
    const currentValue = meta[key];
    if (currentValue == null) return;

    const parts = currentValue.split('|');
    const idx = findIndex(equals(oldValue), parts);
    if (idx === -1) return;

    parts[idx] = value;
    const newValue = uniq(parts).join('|');

    upsertLabelMutation({
      variables: { nctId, key, value: newValue },
      optimisticResponse: {
        upsertWikiLabel: {
          __typename: 'UpsertWikiLabelPayload',
          wikiPage: {
            nctId,
            __typename: 'WikiPage',
            meta: JSON.stringify({ ...meta, [key]: newValue }),
            edits: [],
          },
          errors: null,
        },
      },
    });
  };

  static deleteLabel = (
    key: string,
    value: string,
    meta: {},
    nctId: string,
    upsertLabelMutation: UpsertMutationFn,
    deleteLabelMutation: DeleteMutationFn
  ) => {
    const currentValue = meta[key];
    if (!currentValue) return null;

    const newValue = uniq(
      currentValue.split('|').filter((x) => x !== value)
    ).join('|');
    if (newValue.length === 0) {
      const newMeta = dissoc(key, meta);
      deleteLabelMutation({
        variables: { key, nctId },
        optimisticResponse: {
          deleteWikiLabel: {
            __typename: 'DeleteWikiLabelPayload',
            wikiPage: {
              nctId,
              __typename: 'WikiPage',
              meta: JSON.stringify(newMeta),
              edits: [],
            },
            errors: null,
          },
        },
      });
    } else {
      upsertLabelMutation({
        variables: {
          nctId,
          key,
          value: newValue,
        },
        optimisticResponse: {
          upsertWikiLabel: {
            __typename: 'UpsertWikiLabelPayload',
            wikiPage: {
              nctId,
              __typename: 'WikiPage',
              meta: JSON.stringify({ ...meta, [key]: newValue }),
              edits: [],
            },
            errors: null,
          },
        },
      });
    }
  };

  static addLabel = (
    key: string,
    value: string,
    meta: {},
    nctId: string,
    upsertLabelMutation: UpsertMutationFn
  ) => {
    if (!value) return;
    let val = value;
    if (meta[key]) {
      const oldVal = meta[key];
      const entries = oldVal.split('|').filter((x) => x !== val);
      entries.push(value);
      val = uniq(entries).join('|');
    }
    upsertLabelMutation({
      variables: { nctId, key, value: val },
      optimisticResponse: {
        upsertWikiLabel: {
          __typename: 'UpsertWikiLabelPayload',
          wikiPage: {
            nctId,
            __typename: 'WikiPage',
            meta: JSON.stringify({ ...meta, [key]: val }),
            edits: [],
          },
          errors: null,
        },
      },
    });
  };

  handleAddLabel = (
    key: string,
    value: string,
    meta: {},
    upsertLabelMutation: UpsertMutationFn
  ) => {
    Crowd.addLabel(
      key,
      value,
      meta,
      this.props.match.params.nctId,
      upsertLabelMutation
    );
    this.setState({ forceAddLabel: null });
  };

  handleDeleteLabel = (
    meta: {},
    upsertLabelMutation: UpsertMutationFn,
    deleteLabelMutation: DeleteMutationFn
  ) => (key: string, value: string) => {
    this.props.showAnimation();
    Crowd.deleteLabel(
      key,
      value,
      meta,
      this.props.match.params.nctId,
      upsertLabelMutation,
      deleteLabelMutation
    );
  };

  handleSubmitLabel = (
    meta: {},
    upsertLabelMutation: (x: {
      variables: CrowdPageUpsertWikiLabelMutationVariables;
      optimisticResponse?: CrowdPageUpsertWikiLabelMutation;
    }) => void
  ) => (key: string, oldValue: string, value: string) => {
    console.log('Animeate');
    this.props.showAnimation();
    Crowd.updateLabel(
      key,
      oldValue,
      value,
      meta,
      this.props.match.params.nctId,
      upsertLabelMutation
    );
  };

  handleAddInsideLabelClick = (key: string) => {
    this.setState({ forceAddLabel: { key, value: '' } });
  };

  handleLoaded = () => {
    this.props.onLoaded && this.props.onLoaded();
  };

  renderLabels = (
    meta: {},
    upsertLabelMutation: UpsertMutationFn,
    deleteLabelMutation: DeleteMutationFn
  ) => {
    const labels = pipe(
      keys,
      map((key) =>
        (meta[key] as string).split('|').map((value) => ({ key, value }))
      ),
      //@ts-ignore
      flatten
      //@ts-ignore
    )(meta) as { key: string; value: string }[];

    let content = (
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
          {labels.map((label) => (
            <CrowdLabel
              key={`${label.key} - ${label.value}`}
              name={label.key}
              value={label.value}
              onSubmitClick={this.handleSubmitLabel(meta, upsertLabelMutation)}
              onDeleteClick={this.handleDeleteLabel(
                meta,
                upsertLabelMutation,
                deleteLabelMutation
              )}
              onAddClick={this.handleAddInsideLabelClick}
            />
          ))}
          <CurrentUser>
            {(user) =>
              user &&
              // !this.props.workflowView && (
                <AddCrowdLabel
                  onAddLabel={(key, value) =>
                    this.handleAddLabel(key, value, meta, upsertLabelMutation)
                  }
                  forceAddLabel={this.state.forceAddLabel}
                  showAnimation={this.props.showAnimation}
                />
              // )
            }
          </CurrentUser>
        </tbody>
      </TableWrapper>
    );

    if (this.props.workflowView) {
      content = (
        <CollapsiblePanel header="All Crowd Labels" collapsed>
          {content}
        </CollapsiblePanel>
      );
    }

    return (
      <div>
        <Helmet>
          <title>Crowd Annotations</title>
        </Helmet>
        {content}
      </div>
    );
  };

  render() {
    return (
      <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
        {(upsertLabelMutation) => (
          <DeleteMutationComponent mutation={DELETE_LABEL_MUTATION}>
            {(deleteLabelMutation) => (
              <QueryComponent
                query={QUERY}
                variables={{ nctId: this.props.nctId }}>
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
                      `Error on parsing meta '${data.study.wikiPage.meta}' for nctId: ${this.props.match.params.nctId}`,
                      e
                    );
                    return null;
                  }
                  return this.renderLabels(
                    meta,
                    upsertLabelMutation,
                    deleteLabelMutation
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
