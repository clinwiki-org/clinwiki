module Types
  HealthCheckType = GraphQL::ObjectType.define do
    name "Health"

    field :healthy, !types.Boolean, "Whether the DB connection is healthy", hash_key: :healthy
  end
end
