module Types
    class DesignGroupType < Types::BaseObject
    field :id, Integer, "Intervention id", null: false
    field :group_type, String, null: true
    field :title, String, null: true
    field :description, String, null:true
    field :interventions, [InterventionType], null:true
    end
  end
  