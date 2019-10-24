module Types
  class FacetState < Types::BaseObject
    description "Describe the state of a single facet."
    field :name, String, null: true
    field :value, String, null: true
    field :enable, Boolean, null: true
  end
end