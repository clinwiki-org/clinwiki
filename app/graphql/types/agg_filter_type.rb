module Types
  class AggFilterType < Types::BaseObject
    field :field, String, description: "The field we are filtering on", null: false
    field :values, [String], description: "The values we are filtering for that field", null: false
    field :gte, String, description: "The start value (inclusive) for a range query", null: true
    field :lte, String, description: "The end value (inclusive) for a range query", null: true
    field :include_missing_fields, Boolean, description: "Whether to include missing fields", null: true
    field :zipcode, String, description: "Zipcode used for location search", null: true
    field :radius, String, description: "Radius used for location search", null: true
    field :lat, Float, description: "Location lat", null: true
    field :long, Float, description: "Location Long", null: true
  end
end
