module Types
  class AggFilterInputType < Types::BaseInputObject
    description "An Agg Filter"
    argument :field, String, description: "The field we are filtering on", required: true
    argument :values, [String], description: "The values we are filtering for that field",
             required: false, default_value: []
    argument :gte, String, description: "The start value (inclusive) for a range query", required: false
    argument :lte, String, description: "The end value (inclusive) for a range query", required: false
  end
end
