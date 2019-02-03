class Types::StudyType < Types::BaseObject
  description "AACT Stydy entity"

  field :title, String, "Stydy title", null: true, method: :brief_title
  field :nct_id, String, "Stydy id", null: true
  field :interventions, [Types::InterventionType], "Set of interventions", null: false
end
