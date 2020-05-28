import gql from 'graphql-tag';

export default gql`
  query SearchPageParamsQuery($hash: String) {
    searchParams(hash: $hash) {
      q
      sorts {
        id
        desc
      }
      aggFilters {
        field
        values
        gte
        lte
        includeMissingFields
      }
      crowdAggFilters {
        field
        values
        gte
        lte
        includeMissingFields
      }
      page
      pageSize
    }
  }
`;
