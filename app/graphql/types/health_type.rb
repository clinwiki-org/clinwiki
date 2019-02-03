module Types
  class HealthType < BaseObject
    field :healthy, Boolean, "Whether the DB connection is healthy", null: false, hash_key: :healthy
  end
end
