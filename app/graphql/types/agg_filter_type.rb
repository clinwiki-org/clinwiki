module Types
  class AggFilterType < Types::BaseInputObject
    description "An Agg Filter"
    argument :field, String, description: "The field we are filtering on", required: true
    argument :values, [String], description: "The values we are filtering for that field",
             required: false, default_value: []
  end
end
