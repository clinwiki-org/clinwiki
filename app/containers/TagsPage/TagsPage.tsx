import * as React from 'react';
import styled from 'styled-components';
import { Table, Row, Col, Button, FormControl } from 'react-bootstrap';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import { TagsPageQuery, TagsPageQueryVariables } from 'types/TagsPageQuery';
import StudySummary from 'components/StudySummary';
import * as FontAwesome from 'react-fontawesome';
import {
  TagsPageAddWikiTagMutation,
  TagsPageAddWikiTagMutationVariables,
} from 'types/TagsPageAddWikiTagMutation';
import {
  TagsPageDeleteWikiTagMutation,
  TagsPageDeleteWikiTagMutationVariables,
} from 'types/TagsPageDeleteWikiTagMutation';
import WikiPage from 'containers/WikiPage';

interface TagsPageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

interface TagsPageState {
  newTag: string;
}

const DeleteWrapper = styled.div`
  cursor: pointer;
  color: #cc1111;
  margin-left: auto;
`;

const AddWrapper = styled(Col)`
  display: flex;
`;

const FRAGMENT = gql`
  fragment TagsPageFragment on WikiPage {
    nctId
    tags
  }
`;

const QUERY = gql`
  query TagsPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      wikiPage {
        ...TagsPageFragment
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

const DELETE_TAG_MUTATION = gql`
  mutation TagsPageDeleteWikiTagMutation($nctId: String!, $value: String!) {
    deleteWikiTag(input: { nctId: $nctId, value: $value }) {
      wikiPage {
        ...WikiPageFragment
      }
      errors
    }
  }

  ${WikiPage.fragment}
`;

const ADD_TAG_MUTATION = gql`
  mutation TagsPageAddWikiTagMutation($nctId: String!, $value: String!) {
    upsertWikiTag(input: { nctId: $nctId, value: $value }) {
      wikiPage {
        ...WikiPageFragment
      }
      errors
    }
  }

  ${WikiPage.fragment}
`;

class AddTagMutationComponent extends Mutation<
  TagsPageAddWikiTagMutation,
  TagsPageAddWikiTagMutationVariables
> {}

class DeleteTagMutationComponent extends Mutation<
  TagsPageDeleteWikiTagMutation,
  TagsPageDeleteWikiTagMutationVariables
> {}

class QueryComponent extends Query<TagsPageQuery, TagsPageQueryVariables> {}

class TagsPage extends React.Component<TagsPageProps, TagsPageState> {
  static fragment = FRAGMENT;
  state: TagsPageState = {
    newTag: '',
  };

  handleAddTag = (
    addTag: ({ variables: TagsPageAddWikiTagMutationVariables }) => void,
  ) => () => {
    addTag({
      variables: {
        nctId: this.props.match.params.nctId,
        value: this.state.newTag,
      },
    });
    this.setState({ newTag: '' });
  };

  handleDeleteTag = (
    deleteTag: ({ variables: TagsPageDeleteWikiTagMutationVariables }) => void,
    value: string,
  ) => () => {
    deleteTag({ variables: { value, nctId: this.props.match.params.nctId } });
  };

  handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTag: e.currentTarget.value });
  };

  renderTag = (value: string) => {
    return (
      <tr key={value}>
        <td style={{ display: 'flex' }}>
          <b>{value}</b>
          <DeleteTagMutationComponent mutation={DELETE_TAG_MUTATION}>
            {deleteTag => (
              <DeleteWrapper>
                <FontAwesome
                  name="remove"
                  onClick={this.handleDeleteTag(deleteTag, value)}
                />
              </DeleteWrapper>
            )}
          </DeleteTagMutationComponent>
        </td>
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
            !data.study.wikiPage
          ) {
            return null;
          }

          this.props.onLoaded && this.props.onLoaded();

          const tags = data.study.wikiPage.tags;
          return (
            <Row>
              <Col md={6}>
                <Table striped bordered condensed>
                  <tbody>{tags.map(this.renderTag)}</tbody>
                </Table>
              </Col>
              <AddWrapper md={6}>
                <FormControl
                  type="text"
                  placeholder="Your Tag"
                  value={this.state.newTag}
                  onChange={this.handleNewTagChange}
                />
                <AddTagMutationComponent mutation={ADD_TAG_MUTATION}>
                  {addTag => (
                    <Button
                      onClick={this.handleAddTag(addTag)}
                      style={{ marginLeft: 10 }}
                    >
                      Add Tag
                    </Button>
                  )}
                </AddTagMutationComponent>
              </AddWrapper>
            </Row>
          );
        }}
      </QueryComponent>
    );
  }
}

export default TagsPage;
