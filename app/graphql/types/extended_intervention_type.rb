module Types
  class ExtendedInterventionType < Types::BaseObject
    description "AACT Intervention entity with additional info"

    field :id, Integer, "Intervention id", null: false
    field :nct_id, String, null: false
    field :type, String, "Intervention type", null: true
    field :name, String, "Intervention name", null: true
    field :description, String, "Intervention description", null: true
    field :other_name, String, "Other intervention name", null: true
    field :group_name, String, "Design group name", null: true
    field :group_type, String, "Design group type", null: true
    field :group_description, String, "Design group description", null: true
  end
end
