import * as React from 'react';
import { gql, ApolloError } from 'apollo-boost';
import {
  Mutation,
  MutationFunction,
  MutationComponentOptions,
  MutationResult,
} from 'react-apollo';
import {
  DeleteSiteMutation as DeleteSiteMutationType,
  DeleteSiteMutationVariables,
} from 'types/DeleteSiteMutation';
import { pathOr, reject, propEq } from 'ramda';
import { DeleteSiteMutationsSitesQuery } from 'types/DeleteSiteMutationsSitesQuery';

interface DeleteSiteMutationProps {
  children: (
    mutate: DeleteSiteMutationFn,
    result: MutationResult<DeleteSiteMutationType>
  ) => JSX.Element;
  onCompleted?: (data: DeleteSiteMutationType) => void;
  onError?: (e: ApolloError) => void;
}

const DELETE_SITE_MUTATION = gql`
  mutation DeleteSiteMutation($input: DeleteSiteInput!) {
    deleteSite(input: $input) {
      site {
        id
      }
    }
  }
`;

const SITES_QUERY = gql`
  query DeleteSiteMutationsSitesQuery {
    me {
      id
      ownSites {
        id
      }
      editorSites {
        id
      }
    }
  }
`;

const DeleteSiteMutationComponent = (
  props: MutationComponentOptions<
    DeleteSiteMutationType,
    DeleteSiteMutationVariables
  >
) => Mutation(props);
export type DeleteSiteMutationFn = MutationFunction<
  DeleteSiteMutationType,
  DeleteSiteMutationVariables
>;

class DeleteSiteMutation extends React.PureComponent<DeleteSiteMutationProps> {
  render() {
    return (
      <DeleteSiteMutationComponent
        mutation={DELETE_SITE_MUTATION}
        onCompleted={this.props.onCompleted}
        onError={this.props.onError}
        update={(cache, { data }) => {
          const id = pathOr(null, ['deleteSite', 'site', 'id'], data || {}) as
            | number
            | undefined;
          if (!id) return;
          const currentData = cache.readQuery<DeleteSiteMutationsSitesQuery>({
            query: SITES_QUERY,
          });
          const { editorSites, ownSites } = currentData!.me!;
          const updatedData = {
            me: {
              ...currentData!.me,
              editorSites: reject(propEq('id', id), editorSites),
              ownSites: reject(propEq('id', id), ownSites),
            },
          };
          cache.writeQuery({
            query: SITES_QUERY,
            data: updatedData,
          });
        }}>
        {this.props.children}
      </DeleteSiteMutationComponent>
    );
  }
}

export default DeleteSiteMutation;
