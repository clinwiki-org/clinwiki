module Types
  class FacetState < BaseInputObject
    description "Describe the state of a single facet."
    argument :name, String, "facet name", required: true
    argument :value, String, "facet value", required: true
    argument :enable, Boolean, "", required: true
  end
end