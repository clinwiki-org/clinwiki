import * as React from 'react';
import styled from 'styled-components';
import { Table, Row, Col, FormControl } from 'react-bootstrap';
import {
  Query,
  Mutation,
  MutationComponentOptions,
  QueryComponentOptions,
} from '@apollo/client/react/components';
import { gql, MutationFunction }  from '@apollo/client';
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
import { contains, reject, equals } from 'ramda';
import { WikiPageEditFragment } from 'components/Edits';
import CurrentUser from 'containers/CurrentUser';
import { UserFragment } from 'services/user/model/UserFragment';
import { SiteStudyBasicGenericSectionFragment } from 'services/study/model/SiteStudyBasicGenericSectionFragment';
import ThemedButton from 'components/StyledComponents/index';

interface TagsPageProps {
  nctId: string;
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyBasicGenericSectionFragment;
  showAnimation: any;
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
    meta
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
        ...TagsPageFragment
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

const ADD_TAG_MUTATION = gql`
  mutation TagsPageAddWikiTagMutation($nctId: String!, $value: String!) {
    upsertWikiTag(input: { nctId: $nctId, value: $value }) {
      wikiPage {
        ...TagsPageFragment
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

const AddTagMutationComponent = (
  props: MutationComponentOptions<
    TagsPageAddWikiTagMutation,
    TagsPageAddWikiTagMutationVariables
  >
) => Mutation(props);

type AddTagMutationFn = MutationFunction<
  TagsPageAddWikiTagMutation,
  TagsPageAddWikiTagMutationVariables
>;

const DeleteTagMutationComponent = (
  props: MutationComponentOptions<
    TagsPageDeleteWikiTagMutation,
    TagsPageDeleteWikiTagMutationVariables
  >
) => Mutation(props);

type DeleteTagMutationFn = MutationFunction<
  TagsPageDeleteWikiTagMutation,
  TagsPageDeleteWikiTagMutationVariables
>;

const QueryComponent = (
  props: QueryComponentOptions<TagsPageQuery, TagsPageQueryVariables>
) => Query(props);

class TagsPage extends React.Component<TagsPageProps, TagsPageState> {
  static fragment = FRAGMENT;
  state: TagsPageState = {
    newTag: '',
  };

  getTagsFromMeta = (meta: string) => {
    const tagsString = JSON.parse(meta).tags;
    return tagsString ? tagsString.split('|') : [];
  };

  updateMetaTags = (
    updater: (tags: string[]) => string[],
    meta: string
  ): string => {
    const tags = this.getTagsFromMeta(meta);
    const parsedMeta = JSON.parse(meta);
    parsedMeta.tags = updater(tags).join('|');
    return JSON.stringify(parsedMeta);
  };

  handleAddTag = (meta: string, addTag: AddTagMutationFn) => () => {
    this.props.showAnimation()
    addTag({
      optimisticResponse: {
        upsertWikiTag: {
          __typename: 'UpsertWikiTagPayload',
          wikiPage: {
            __typename: 'WikiPage',
            nctId: this.props.nctId,
            meta: this.updateMetaTags(
              tags =>
                contains(this.state.newTag, tags)
                  ? tags
                  : [...tags, this.state.newTag],
              meta
            ),
            edits: [],
          },
          errors: null,
        },
      },
      variables: {
        nctId: this.props.nctId,
        value: this.state.newTag,
      },
    });
    this.setState({ newTag: '' });
  };

  handleDeleteTag = (
    meta: string,
    deleteTag: DeleteTagMutationFn,
    value: string
  ) => () => {
    deleteTag({
      variables: { value, nctId: this.props.nctId },
      optimisticResponse: {
        deleteWikiTag: {
          __typename: 'DeleteWikiTagPayload',
          wikiPage: {
            __typename: 'WikiPage',
            nctId: this.props.nctId,
            meta: this.updateMetaTags(reject(equals(value)), meta),
            edits: [],
          },
          errors: null,
        },
      },
    });
  };

  handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTag: e.currentTarget.value });
  };
//@ts-ignore
  renderTag = (meta: string, value: string, user: UserFragment | null) => {
    return (
      <tr key={value}>
        <td style={{ display: 'flex' }}>
          <b>{value}</b>
          {user && (
            <DeleteTagMutationComponent mutation={DELETE_TAG_MUTATION}>
              {deleteTag => (
                <DeleteWrapper>
                  <FontAwesome
                    name="remove"
                    onClick={this.handleDeleteTag(meta, deleteTag, value)}
                  />
                </DeleteWrapper>
              )}
            </DeleteTagMutationComponent>
          )}
        </td>
      </tr>
    );
  };

  render() {
    return (
      <QueryComponent query={QUERY} variables={{ nctId: this.props.nctId }}>
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

          const meta = data.study.wikiPage.meta;
          const tags = this.getTagsFromMeta(meta);
          return (
            <CurrentUser>
              {user => (
                <Row>
                  <Col md={6}>
                    <Table striped bordered condensed>
                      <tbody>
                        {tags.map(tag => this.renderTag(meta, tag, user))}
                      </tbody>
                    </Table>
                  </Col>
                  {user && (
                    <AddWrapper md={6}>
                      <FormControl
                        type="text"
                        placeholder="Your Tag"
                        value={this.state.newTag}
                        onChange={this.handleNewTagChange}
                      />
                      <AddTagMutationComponent mutation={ADD_TAG_MUTATION}>
                        {addTag => (
                          <ThemedButton
                            onClick={this.handleAddTag(meta, addTag)}
                            style={{ marginLeft: 10 }}>
                            Add Tag
                          </ThemedButton>
                        )}
                      </AddTagMutationComponent>
                    </AddWrapper>
                  )}
                </Row>
              )}
            </CurrentUser>
          );
        }}
      </QueryComponent>
    );
  }
}

export default TagsPage;
