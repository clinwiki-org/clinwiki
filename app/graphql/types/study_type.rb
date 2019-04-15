module Types
  class StudyType < Types::BaseObject
    implements TimestampsType

    description "AACT Stydy entity"

    field :brief_title, String, null: true
    field :nct_id, String, null: false
    field :average_rating, Float, null: false
    field :source, String, null: false
    field :type, String, null: false
    field :overall_status, String, null: true
    field :start_date, String, null: true
    field :completion_date, String, null: true
    field :enrollment, Int, null: true

    field :administrative_info, AdministrativeInfoType, null: false
    field :recruitment_info, RecruitmentInfoType, null: false
    field :tracking_info, TrackingInfoType, null: false
    field :descriptive_info, DescriptiveInfoType, null: false
    field :wiki_page, WikiPageType, null: true
    field :interventions, [InterventionType], null: false
    field :reviews, [ReviewType], null: false
    field :facilities, [FacilityType], null: false
    field :average_rating, Float, null: false
    field :reviews_count, Int, null: false

    def administrative_info
      object
    end

    def recruitment_info
      object
    end

    def tracking_info
      object
    end

    def descriptive_info
      object
    end

    def wiki_page
      Loaders::Association.for(Study, :wiki_page)
        .load(object)
        .then { |page| page || WikiPage.new(nct_id: object.nct_id) }
    end

    def average_rating
      Loaders::Association.for(Study, :reviews)
        .load(object)
        .then { |_| object.average_rating }
    end

    def overall_status
      wiki_page.then { object.with_wiki_data(:overall_status) }
    end

    def type
      wiki_page.then { object.with_wiki_data(:study_type) }
    end

    def interventions
      Loaders::Association.for(Study, :interventions).load(object)
    end

    def reviews
      Loaders::Association.for(Study, :reviews).load(object)
    end

    def facilities
      Loaders::Association.for(Study, :facilities).load(object)
    end
  end
end
