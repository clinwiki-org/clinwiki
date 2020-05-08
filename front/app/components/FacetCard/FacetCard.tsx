import * as React from 'react';
import styled from 'styled-components';
import { capitalize } from 'utils/helpers';
import { gql } from 'apollo-boost';
import { Mutation, Query, MutationFn } from 'react-apollo';
import { match } from 'react-router-dom';
import ThemedButton, {
  ThemedPresearchCard,
  ThemedPresearchHeader,
  PresearchTitle,
  PresearchFilter,
  PresearchPanel,
  PresearchContent,
  TextFieldToggle,
} from 'components/StyledComponents';
import { FormControl } from 'react-bootstrap';
import {
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables,
} from 'types/CrowdPageUpsertWikiLabelMutation';
import { findIndex, equals, uniq } from 'ramda';
import { WikiPageEditFragment } from 'components/Edits';
import AddFacetCard from './AddFacetCard';
import CrowdPage from 'containers/CrowdPage';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 5px;
`;

const FRAGMENT = gql`
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;

export const UPSERT_LABEL_MUTATION = gql`
  mutation CrowdPageUpsertWikiLabelMutation(
    $nctId: String!
    $key: String!
    $value: String!
  ) {
    upsertWikiLabel(input: { nctId: $nctId, key: $key, value: $value }) {
      wikiPage {
        ...CrowdPageFragment
        edits {
          ...WikiPageEditFragment
        }
      }
      errors
    }
  }

  ${FRAGMENT}
  ${WikiPageEditFragment}
`;

export class UpsertMutationComponent extends Mutation<
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables
> {}

export type UpsertMutationFn = MutationFn<
  CrowdPageUpsertWikiLabelMutation,
  CrowdPageUpsertWikiLabelMutationVariables
>;

interface FacetCardProps {
  nctId?: string;
  label: string;
  children?: any;
  onSelect?: any;
  bulk?: boolean;
  addLabel?: boolean;
  meta?: any;
}

interface FacetCardState {
  textFieldActive: boolean;
  existingField: string;
}

class FacetCard extends React.PureComponent<FacetCardProps, FacetCardState> {
  state = {
    textFieldActive: false,
    existingField: '',
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
      console.log(meta[key]);
      const oldVal = meta[key];
      const entries = oldVal.split('|').filter(x => x !== val);
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

  handlePlusClick = () => {
    this.setState({
      textFieldActive: !this.state.textFieldActive,
    });
  };

  handleExistingFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      existingField: e.target.value,
    });
  };

  submitExistingField = (
    key: string,
    value: string,
    meta: {},
    upsertLabelMutation: UpsertMutationFn
  ) => {
    console.log('this happened');
    console.log(key, value, meta, this.props.nctId, upsertLabelMutation);
    if (this.props.nctId) {
      CrowdPage.addLabel(
        key,
        value,
        meta,
        this.props.nctId,
        upsertLabelMutation
      );
    } else alert('error');
  };

  handleButtonClick = upsertLabelMutation => {
    this.submitExistingField(
      this.props.label,
      this.state.existingField,
      this.props.meta,
      upsertLabelMutation
    );
    this.setState({ textFieldActive: false });
  };

  handleNewFacetSubmit = (key, value, upsertLabelMutation) => {
    this.submitExistingField(key, value, this.props.meta, upsertLabelMutation);
  };

  render() {
    const { label, addLabel, bulk } = this.props;
    const { textFieldActive, existingField } = this.state;
    if (bulk) {
      return (
        <ThemedPresearchCard>
          <ThemedPresearchHeader>
            <PresearchTitle>{capitalize(label)}</PresearchTitle>
          </ThemedPresearchHeader>
          <PresearchContent style={{ overflowY: 'auto' }}>
            {this.props.children}
          </PresearchContent>
        </ThemedPresearchCard>
      );
    }
    if (addLabel) {
      return (
        <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
          {upsertLabelMutation => (
            <ThemedPresearchCard>
              <ThemedPresearchHeader>
                <PresearchTitle>{capitalize(label)}</PresearchTitle>
              </ThemedPresearchHeader>
              <PresearchContent style={{ overflowY: 'auto' }}>
                <AddFacetCard
                  upsert={upsertLabelMutation}
                  submitFacet={this.handleNewFacetSubmit}
                />
              </PresearchContent>
            </ThemedPresearchCard>
          )}
        </UpsertMutationComponent>
      );
    }
    return (
      <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
        {upsertLabelMutation => (
          <ThemedPresearchCard>
            <ThemedPresearchHeader>
              <PresearchTitle>{capitalize(label)}</PresearchTitle>
              {/* {!textFieldActive && (
                <TextFieldToggle onClick={this.handlePlusClick}>
                  +
                </TextFieldToggle>
              )}
              {textFieldActive && (
                <TextFieldToggle onClick={this.handlePlusClick}>
                  X
                </TextFieldToggle>
              )} */}
            </ThemedPresearchHeader>
            {textFieldActive && (
              <Row>
                <FormControl
                  name="description"
                  placeholder="add label description"
                  value={existingField}
                  onChange={this.handleExistingFieldChange}
                  style={{ marginRight: 5 }}
                />
                <ThemedButton
                  onClick={() => this.handleButtonClick(upsertLabelMutation)}>
                  +
                </ThemedButton>
              </Row>
            )}
            <PresearchContent style={{ overflowY: 'auto' }}>
              {this.props.children}
            </PresearchContent>
          </ThemedPresearchCard>
        )}
      </UpsertMutationComponent>
    );
  }
}

export default FacetCard;
