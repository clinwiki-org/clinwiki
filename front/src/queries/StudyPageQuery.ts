import StudySummary from 'components/StudySummary';
import gql from 'graphql-tag';

export default gql`
query StudyPageQuery($nctId: String!) {
  study(nctId: $nctId) {
    ...StudySummaryFragment
    nctId
  }
}

${StudySummary.fragment}
`;
