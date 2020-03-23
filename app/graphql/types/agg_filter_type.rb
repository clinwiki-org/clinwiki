module Types
  class AggFilterType < Types::BaseObject
    field :field, String, description: "The field we are filtering on", null: false
    field :values, [String], description: "The values we are filtering for that field", null: false
    field :gte, String, description: "The start value (inclusive) for a range query", null: true
    field :lte, String, description: "The end value (inclusive) for a range query", null: true
  end
end
