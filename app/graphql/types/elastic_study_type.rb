module Types
  class ElasticStudyType < Types::BaseObject 
    implements TimestampsType

    description "Elasticsearch indexed study values"

    field :brief_title, String, null: true
    field :nct_id, String, null: false
    field :source, String, null: false
    field :overall_status, String, null: true
    field :start_date, String, null: true
    field :completion_date, String, null: true
    field :enrollment, Int, null: true

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
    field :study_type, String, null: true
    field :acronym, String, null: true
    field :baseline_population, String, null: true
    field :official_title, String, null: true
    field :last_known_status, String, null: true
    field :phase, String, null: true
    field :enrollment_type, String, null: true
    field :number_of_arms, String, null: true
    field :number_of_groups, String, null: true
    field :has_expanded_access, String, null: true
    field :expanded_access_type_treatment, String, null: true
    field :is_fda_regulated_drug, String, null: true
    field :is_fda_regulated_device, String, null: true
    field :ipd_time_frame, String, null: true
    field :ipd_access_criteria, String, null: true
    field :ipd_url, String, null: true
    field :plan_to_share_ipd, String, null: true
    field :plan_to_share_ipd_description, String, null: true
    field :why_stopped, String, null: true
    
    field :average_rating, Float, null: false
    field :reviews_count, Int, null: true

    # Descriptive
    field :brief_title, String, null: false
    field :study_type, String, null: false
    field :official_title, String, null: true
    field :phase, String, null: true

    field :brief_summary, String, null: true
    field :detailed_description, String, null: true
    field :conditions, String, null: true

    # Administrative
    field :is_fda_regulated, Boolean, null: false
    field :plan_to_share_ipd, String, null: true
    field :plan_to_share_ipd_description, String, null: true
    field :source, String, null: false

    # Recuitment
    field :overall_status, String, null: false
    field :enrollment, Int, null: true
    field :completion_date, DateTimeType, null: true

    # Tracking
    field :start_date, DateTimeType, null: true


    field :interventions, [String], null: false
    field :interventions_mesh_terms, [String], null: false 
    field :facility_states,[String], null: false
    


    def is_fda_regulated
      object.is_fda_regulated_drug | object.is_fda_regulated_device
    end

    def completion_date
      object.completion_date&.to_datetime
    end
    
  end
end
