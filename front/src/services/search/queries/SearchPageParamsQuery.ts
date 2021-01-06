export default `
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
        zipcode
        radius
        lat
        long
      }
      crowdAggFilters {
        field
        values
        gte
        lte
        includeMissingFields
        zipcode
        radius
        lat
        long
      }
    }
  }
`;