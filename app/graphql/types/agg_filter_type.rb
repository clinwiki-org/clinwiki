module Types
  class AggFilterType < Types::BaseObject
    field :field, String, description: "The field we are filtering on", null: false
    field :values, [String], description: "The values we are filtering for that field", null: false
  end
end
