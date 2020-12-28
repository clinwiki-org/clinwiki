import * as React from 'react';
import { gql, ApolloError }  from '@apollo/client';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import { MutationFunction, MutationResult } from '@apollo/client';
import {
  DeleteSiteMutation as DeleteSiteMutationType,
  DeleteSiteMutationVariables,
} from 'services/site/model/DeleteSiteMutation';
import { pathOr, reject, propEq } from 'ramda';
import { DeleteSiteMutationsSitesQuery } from 'services/site/model/DeleteSiteMutationsSitesQuery';

import {deleteSite} from 'services/site/actions'
import {useDispatch,useSelector} from 'react-redux';
import {RootState} from 'reducers';


interface DeleteSiteMutationProps {
  children: (
    mutate: DeleteSiteMutationFn,
    result: MutationResult<DeleteSiteMutationType>
  ) => JSX.Element;
  onCompleted?: (data: DeleteSiteMutationType) => void;
  onError?: (e: ApolloError) => void;
}

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
