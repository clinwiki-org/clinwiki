import gql from 'graphql-tag'
import Edits, { WikiPageEditFragment } from 'components/Edits';

export const FRAGMENT = gql`
  fragment WikiPageFragment on WikiPage {
    content
    edits {
      ...WikiPageEditFragment
    }
    nctId
    meta
  }

  ${WikiPageEditFragment}
`;

export default gql`
  query WikiPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        ...WikiPageFragment
      }
      nctId
    }
    me {
      id
    }
  }
  ${FRAGMENT}
`;