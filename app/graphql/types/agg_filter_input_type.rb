module Types
  class AggFilterInputType < Types::BaseInputObject
    description "An Agg Filter"
    argument :field, String, description: "The field we are filtering on", required: true
    argument :values, [String], description: "The values we are filtering for that field",
             required: false, default_value: []
    argument :gte, String, description: "The start value (inclusive) for a range query", required: false
    argument :lte, String, description: "The end value (inclusive) for a range query", required: false
    argument :include_missing_fields, Boolean, description: "Whether to include missing fields in the query", required: false
    argument :radius, Int, description: "Radius used for distance search", required: false
    argument :lat, Float, description: "Location lattituted", required: false
    argument :long, Float, description: "Location longitude", required: false
  end
end
