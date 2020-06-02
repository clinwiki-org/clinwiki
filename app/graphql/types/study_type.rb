module Types
  class StudyType < Types::BaseObject # rubocop:disable Metrics/ClassLength
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

    field :wiki_page, WikiPageType, null: true
    field :interventions, [InterventionType], null: false
    field :extended_interventions, [ExtendedInterventionType], null: false
    field :reviews, [ReviewType], null: false
    field :facilities, [FacilityType], null: false
    field :average_rating, Float, null: false
    field :reviews_count, Int, null: false

    # Descriptive
    field :brief_title, String, null: false
    field :study_type, String, null: false
    field :official_title, String, null: true
    field :phase, String, null: true

    field :brief_summary, String, null: true
    field :detailed_description, String, null: true
    field :conditions, String, null: true

    field :design, String, null: false
    field :study_arms, String, null: false
    field :publications, String, null: false

    # Administrative
    field :other_study_ids, String, null: false
    field :has_data_monitoring_committee, Boolean, null: false
    field :is_fda_regulated, Boolean, null: false, method: :fda_regulated_product?
    field :plan_to_share_ipd, String, null: true
    field :plan_to_share_ipd_description, String, null: true
    field :responsible_party, String, null: false
    field :sponsor, String, null: false
    field :collaborators, String, null: false
    field :investigators, String, null: false
    field :source, String, null: false
    field :verification_date, DateTimeType, null: true

    # Recuitment
    field :overall_status, String, null: false
    field :enrollment, Int, null: true
    field :completion_date, DateTimeType, null: true
    field :primary_completion_date, DateTimeType, null: true

    field :eligibility_criteria, String, null: false
    field :eligibility_gender, String, null: false
    field :eligibility_healthy_volunteers, String, null: false

    field :ages, String, null: false
    field :contacts, String, null: false
    field :listed_location_countries, String, null: false
    field :removed_location_countries, String, null: false

    # Tracking
    field :first_received_date, DateTimeType, null: true
    field :last_changed_date, DateTimeType, null: true
    field :start_date, DateTimeType, null: true
    field :primary_completion_date, DateTimeType, null: true
    field :primary_measures, String, null: true
    field :secondary_measures, String, null: true
    field :likes_count, Integer,null: false
    field :dislikes_count, Integer, null:false
    field :reactions_count,[ExpressionCountType], null: true


    def reactions_count
      object.reaction_kinds.group(:name).count
    end

    def likes_count
      object.reaction_kinds.where(name:"like").count
    end
    def dislikes_count
      object.reaction_kinds.where(name:"dislike").count
    end

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
      Loaders::CustomAssociation.for(Study, :interventions).load(object)
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

    def first_received_date
      object.try(:first_received_date, nil)
    end

    def last_changed_date
      object.try(:last_changed_date, nil)
    end

    def design
      "tbd"
    end

    def study_arms
      "tbd"
    end

    def publications
      "tbd"
    end

    def has_data_monitoring_committee # rubocop:disable Naming/PredicateName
      object.has_dmc || false
    end

    def other_study_ids
      "tbd"
    end

    def responsible_party
      "tbd"
    end

    def sponsor
      "tbd"
    end

    def collaborators
      "tbd"
    end

    def investigators
      "tbd"
    end

    def brief_summary
      Loaders::Association.for(Study, :brief_summary).load(object).then { |bs| bs&.description }
    end

    def detailed_description
      Loaders::Association.for(Study, :detailed_description).load(object).then { |dd| dd&.description }
    end

    def conditions
      Loaders::Association.for(Study, :all_condition).load(object).then { |dd| dd&.names }
    end

    def completion_date
      object.completion_date&.to_datetime
    end

    def ages
      "tbd"
    end

    def contacts
      "tbd"
    end

    def listed_location_countries
      "tbd"
    end

    def removed_location_countries
      "tbd"
    end

    def primary_measures
      measures("primary")
    end

    def secondary_measures
      measures("secondary")
    end

    def eligibility_criteria
      eligibility.then(&:criteria)
    end

    def eligibility_gender
      eligibility.then(&:gender)
    end

    def eligibility_healthy_volunteers
      eligibility.then(&:healthy_volunteers)
    end

    private

    def eligibility
      Loaders::Association.for(Study, :eligibility).load(object)
    end

    def measures(kind)
      Loaders::Association.for(Study, :design_outcomes).load(object).then do |outcomes|
        res = outcomes
          .select { |outcome| outcome.type == kind }
          .map(&:measure)
          .join(" | ")
        res.presence
      end
    end
  end
end
