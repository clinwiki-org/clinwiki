import StudySummary from 'components/StudySummary';
import gql from 'graphql-tag';

export default gql`
query ReactionKinds {
  reactionKinds {
    id
    name
    unicode
  }
}
`;