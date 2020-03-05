class ClinwikiSchema < GraphQL::Schema
  max_depth 10
  max_complexity 500
  mutation(Types::MutationType)
  query(Types::QueryType)

  use GraphQL::Batch
end
