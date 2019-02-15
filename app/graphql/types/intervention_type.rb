module Types
  class InterventionType < Types::BaseObject
    description "AACT Intervention entity"

    field :type, String, "Intervention type", null: true, method: :intervention_type
    field :name, String, "Intervention name", null: true
    field :description, String, "Intervention description", null: true
  end
end
