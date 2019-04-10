module Types
  class DesignOutcomeType < Types::BaseObject
    field :nct_id, String, null: false
    field :outcome_type, String, null: false
    field :measure, String, null: false
    field :description, String, null: true
  end
end
