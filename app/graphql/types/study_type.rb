module Types
  class StudyType < Types::BaseObject
    implements TimestampsType

    description "AACT Stydy entity"

    field :brief_title, String, null: true
    field :nct_id, String, null: false
    field :source, String, null: false
    field :type, String, null: false
    field :overall_status, String, null: true
    field :start_date, String, null: true
    field :completion_date, String, null: true
    field :enrollment, Int, null: true

    field :nlm_download_date_description, String, null: true
    field :study_first_submitted_date, String, null: true
    field :results_first_submitted_date, String, null: true
    field :disposition_first_submitted_date, String, null: true
    field :last_update_submitted_date, String, null: true
    field :study_first_submitted_qc_date, String, null: true
    field :study_first_posted_date, String, null: true
    field :study_first_posted_date_type, String, null: true
    field :results_first_submitted_qc_date, String, null: true
    field :results_first_posted_date, String, null: true
    field :results_first_posted_date_type, String, null: true
    field :disposition_first_submitted_qc_date, String, null: true
    field :disposition_first_posted_date, String, null: true
    field :disposition_first_posted_date_type, String, null: true
    field :last_update_submitted_qc_date, String, null: true
    field :last_update_posted_date, String, null: true
    field :last_update_posted_date_type, String, null: true
    field :start_month_year, String, null: true
    field :start_date_type, String, null: true
    field :verification_month_year, String, null: true
    field :verification_date, String, null: true
    field :completion_month_year, String, null: true
    field :completion_date_type, String, null: true
    field :primary_completion_month_year, String, null: true
    field :primary_completion_date_type, String, null: true
    field :primary_completion_date, String, null: true
    field :target_duration, String, null: true
    field :study_type, String, null: true
    field :acronym, String, null: true
    field :baseline_population, String, null: true
    field :official_title, String, null: true
    field :last_known_status, String, null: true
    field :phase, String, null: true
    field :enrollment_type, String, null: true
    field :limitations_and_caveats, String, null: true
    field :number_of_arms, String, null: true
    field :number_of_groups, String, null: true
    field :why_stopped, String, null: true
    field :has_expanded_access, String, null: true
    field :expanded_access_type_individual, String, null: true
    field :expanded_access_type_intermediate, String, null: true
    field :expanded_access_type_treatment, String, null: true
    field :has_dmc, String, null: true
    field :is_fda_regulated_drug, String, null: true
    field :is_fda_regulated_device, String, null: true
    field :is_unapproved_device, String, null: true
    field :is_ppsd, String, null: true
    field :is_us_export, String, null: true
    field :biospec_retention, String, null: true
    field :biospec_description, String, null: true
    field :ipd_time_frame, String, null: true
    field :ipd_access_criteria, String, null: true
    field :ipd_url, String, null: true
    field :plan_to_share_ipd, String, null: true
    field :plan_to_share_ipd_description, String, null: true

    field :administrative_info, AdministrativeInfoType, null: false
    field :recruitment_info, RecruitmentInfoType, null: false
    field :tracking_info, TrackingInfoType, null: false
    field :descriptive_info, DescriptiveInfoType, null: false
    field :wiki_page, WikiPageType, null: true
    field :interventions, [InterventionType], null: false
    field :extended_interventions, [ExtendedInterventionType], null: false
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

    def extended_interventions
      Loaders::CustomAssociation.for(Study, :extended_interventions).load(object)
    end
  end
end
