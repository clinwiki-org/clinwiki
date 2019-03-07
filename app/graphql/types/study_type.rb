module Types
  class StudyType < Types::BaseObject
    description "AACT Stydy entity"

    field :brief_title, String, null: true
    field :nct_id, String, null: false
    field :average_rating, Float, null: false
    field :overall_status, String, null: true
    field :start_date, String, null: true
    field :completion_date, String, null: true

    field :interventions, [Types::InterventionType], "Set of interventions", null: false

    def overall_status
      object.with_wiki_data(:overall_status)
    end
  end
end
