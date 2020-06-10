class Study < AactRecord # rubocop:disable Metrics/ClassLength
  self.primary_key = "nct_id"

  def self.wiki_page_edit_mapping
     {
       study:{
         properties:{
           wiki_page_edits:
           {
             type: 'nested'}
           }
       }
     }
  end

  attr_reader :excluded_wiki_data

  searchkick merge_mappings: true, callbacks: :queue, batch_size: 25, mappings: Study.wiki_page_edit_mapping

  has_one :wiki_page, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :wiki_page_edits, through: :wiki_page
  has_one  :brief_summary,         foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_one  :design,                foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_one  :detailed_description,  foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_one  :eligibility,           foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_one  :participant_flow,      foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_one  :calculated_value,      foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception

  has_many :baseline_measurements, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :reactions, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :reaction_kinds, through: :reactions, dependent: :restrict_with_exception
  has_many :baseline_counts,       foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :browse_conditions,     foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :browse_interventions,  foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :central_contacts,      foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :conditions,            foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :countries,             foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :design_outcomes,       foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :design_groups,         foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :design_group_interventions, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :drop_withdrawals,      foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception

  has_many :facilities,            foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :facility_contacts,     foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :facility_investigators, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :id_information,        foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :interventions,         foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :all_interventions,     foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_one :all_condition, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :intervention_other_names, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :keywords,              foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :links,                 foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :milestones,            foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :outcomes,              foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :outcome_analysis_groups, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :outcome_analyses,      foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :outcome_measurements,  foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :overall_officials,     foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :references,            foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :reported_events,       foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :responsible_parties,   foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :result_agreements,     foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :result_contacts,       foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :result_groups,         foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception
  has_many :sponsors,              foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception

  # clinwiki relationships
  has_many :reviews, foreign_key: "nct_id", inverse_of: :study, dependent: :restrict_with_exception

  scope :find_by_term, ->(term) { where("nct_id in (select nct_id from ids_for_term(?))", "%#{term}%") }

  NON_INDEX_FIELDS = %i[
    nlm_download_date_description first_received_date last_changed_date
    first_received_results_date received_results_disposit_date
    start_month_year start_date_type verification_month_year
    verification_date completion_month_year completion_date_type
    primary_completion_month_year primary_completion_date_type
    primary_completion_date target_duration limitations_and_caveats
    number_of_arms number_of_groups why_stopped has_expanded_access
    expanded_access_type_individual expanded_access_type_intermediate
    expanded_access_type_treatment has_dmc is_fda_regulated_drug
    is_fda_regulated_device is_unapproved_device is_ppsd is_us_export
    biospec_retention biospec_description plan_to_share_ipd design_outcome_measures
  ].freeze

  def reviews_count
    Review.where(nct_id: nct_id).count
  end

  def average_rating
    @average_rating ||=
      begin
        ratings = reviews.reject { |r| r.overall_rating.blank? }.map(&:overall_rating)
        if ratings.blank?
          0
        else
          (ratings.reduce(:+).to_f / ratings.count).round(2)
        end
      end
  end

  def display_start_date
    start_date&.to_date&.strftime("%B %Y")
  end

  def display_interventions
    res = Study.connection.execute("select intervention from all_interventions where nct_id='#{nct_id}'")
    res.first["intervention"] if res.first.present?
  end

  def display_conditions
    res = Study.connection.execute("select condition from all_conditions where nct_id='#{nct_id}'")
    res.first["condition"] if res.first.present?
  end

  def primary_outcomes
    design_outcomes.select { |o| o.type.downcase == "primary" }
  end

  def secondary_outcomes
    design_outcomes.select { |o| o.type.downcase == "secondary" }
  end

  def primary_outcome_measures
    primary_outcomes.collect(&:display_outcome).join("; ")
  end

  def secondary_outcome_measures
    secondary_outcomes.collect(&:display_outcome).join("; ")
  end

  def fda_regulated_product?
    is_fda_regulated_device || is_fda_regulated_drug || false
  end

  def administrative_info
    [
      { label: "NCT Number", value: nct_id },
      { label: "Other Study ID Numbers", value: "tbd" },
      { label: "Has Data Monitoring Committee", value: has_dmc },
      { label: "Is FDA-Regulated Product", value: fda_regulated_product? },
      { label: "Plan to Share Data", value: plan_to_share_ipd },
      { label: "IPD Description", value: plan_to_share_ipd_description },
      { label: "Responsible Party", value: "tbd" },
      { label: "Sponsor", value: "tbd" },
      { label: "Collaborators", value: "tbd" },
      { label: "Investigators", value: "tbd" },
      { label: "Information Provided By", value: source },
      { label: "Verification Date", value: verification_date },
    ]
  end

  def tracking_info
    [
      { label: "first_received_date", value: try(:first_received_date, nil) },
      { label: "last_changed_date", value: try(:last_changed_date, nil) },
      { label: "start_date", value: start_date },
      { label: "primary_completion_date", value: primary_completion_date },
      { label: "primary outcome measures", value: primary_outcome_measures },
      { label: "secondary outcome measures", value: secondary_outcome_measures },
    ]
  end

  def descriptive_info
    [
      { label: "brief title", value: brief_title },
      { label: "official title", value: official_title },
      { label: "brief summary", value: brief_summary.description },
      { label: "detailed description", value: detailed_description.try(:description) },
      { label: "study type", value: study_type },
      { label: "study phase", value: phase },
      { label: "study design", value: "tbd" },
      { label: "conditions", value: display_conditions },
      { label: "study arms", value: "tbd" },
      { label: "publications", value: "tbd" },
    ]
  end

  def recruitment_info
    [
      { label: "recruitment status", value: overall_status },
      { label: "enrollment", value: enrollment },
      { label: "completion date", value: completion_date },
      { label: "primary completion date", value: primary_completion_date },
      { label: "eligibility criteria", value: eligibility.criteria },
      { label: "gender", value: eligibility.gender },
      { label: "ages", value: "tbd" },
      { label: "accepts healthy volunteers", value: eligibility.healthy_volunteers },
      { label: "contacts", value: "tbd" },
      { label: "listed location countries", value: "tbd" },
      { label: "removed location countries", value: "tbd" },
    ]
  end

  def site_info
    col = []
    facility_count = 1
    facilities.each do |f|
      col << { label: "Facility #{facility_count}", value: f.description.strip }
      facility_contacts.where(facility: f).find_each do |contact|
        contact_data = ""
        contact_data += " #{contact.name}"
        contact_data += " email: #{contact.email}" if contact.email.present?
        contact_data += " phone: #{contact.phone}" if contact.phone.present?
        col << {
          label: "Facility #{facility_count} #{contact.contact_type} contact",
          value: contact_data,
        }
      end
      facility_count += 1
    end
    col
  end

  scope :search_import, -> {
    includes(:brief_summary, :detailed_description, :browse_conditions, :reviews,
             :facilities, :sponsors, :wiki_page,
             :design_outcomes, :interventions, :browse_interventions)
  }

  def rating_dimensions
    dimensions = {}
    reviews.each do |r|
      r.stars.keys.each do |key|
        dimensions[key] = dimensions.fetch(key, []).concat([r.stars[key]])
      end
    end
    dimensions
  end

  def average_rating_dimensions
    Hash[rating_dimensions.map { |key, vals| [key, vals.inject { |sum, el| sum + el }.to_f / vals.size] }]
  end

  # Indexing data from the wiki page
  # @return [Hash]
  def wiki_search_data
    return {} if wiki_page.nil?

    wiki_page.search_data
  end

  # Defines the fields to be indexed by searchkick
  # @return [Hash]
  def search_data
    attributes.merge(
      brief_summary: brief_summary && brief_summary.description,
      detailed_description: detailed_description && detailed_description.description,
      browse_condition_mesh_terms: browse_conditions.map(&:mesh_term),
      browse_interventions_mesh_terms: browse_interventions.map(&:mesh_term),
      interventions_mesh_terms: interventions.map(&:name).reject(&:nil?),
      interventions: interventions.map(&:description).reject(&:nil?),
      design_outcome_measures: design_outcomes.map(&:measure),
      facility_names: facilities.map(&:name),
      facility_states: facilities.map(&:state),
      facility_cities: facilities.map(&:city),
      facility_countries: facilities.map(&:country),
      average_rating: average_rating,
      reviews: reviews && reviews.map(&:text),
      sponsors: sponsors && sponsors.map(&:name),
      rating_dimensions: rating_dimensions.keys,
      indexed_at: Time.now.utc,
      wiki_page_edits: {
        email: wiki_page_edits.map(&:user).map(&:email),
        created_at: wiki_page_edits.map(&:created_at).map(&:to_time),
      },
    ).merge(
      average_rating_dimensions,
    ).merge(
      wiki_search_data,
    ).except(
      # https://github.com/clinwiki-org/clinwiki/issues/111
      *NON_INDEX_FIELDS, *NON_INDEX_FIELDS.map(&:to_s)
    )
  end

  # manually publish to reindex queue
  def enqueue_reindex_job
    Study.enqueue_reindex_ids(nct_id)
  end

  def exclude_wiki_data
    @excluded_wiki_data = true
  end

  def include_wiki_data
    @excluded_wiki_data = false
  end

  def with_wiki_data(field)
    return try(field) if @excluded_wiki_data

    try(:wiki_page).try(field.to_s) || send(field)
  end

  def to_json
    {
      nct_id: nct_id,
      brief_title: brief_title,
      study_type: with_wiki_data(:study_type),
      overall_status: with_wiki_data(:overall_status),
      phase: phase,
      primary_completion_date: with_wiki_data(:primary_completion_date),
      enrollment: enrollment,
      enrollment_type: enrollment_type,
      source: source,
      reviews_length: reviews.count,
      average_rating: average_rating,
    }
  end

  def reload
    super
    self.extended_interventions_raw = nil
    self.interventions_raw = nil
  end

  def interventions
    @interventions || Study.preload_interventions(self)
    @interventions
  end

  def interventions_raw
    @interventions
  end

  def interventions_raw=(value)
    @interventions = value
  end

  def self.preload_interventions(studies) # rubocop:disable Metrics/MethodLength
    studies = studies.is_a?(Array) ? studies : [studies]
    study_groups = studies.group_by(&:nct_id)
    ids = studies.map(&:id)
    ids_sql = ids.map { |id| "\'#{id}\'" }.join(",")
    query = <<-SQL
        SELECT
        -- dg.group_type,
        -- dg.title,
        -- dg.description,
        -- ion.name as other_name,
          i.id,
          i.name,
          i.intervention_type,
          i.description,
          i.nct_id
        FROM interventions i
        left outer join intervention_other_names ion
          on i.id = ion.intervention_id
        left outer join design_group_interventions dgi
          on i.id = dgi.intervention_id
        left outer join design_groups dg
        on dgi.design_group_id = dg.id
        where dg.nct_id IN (#{ids_sql})
        order by dg.group_type
      SQL

    rows = AactRecord.connection.execute(query)
    # Successfully executed sql query - reset interventions
    studies.each { |study| study.interventions_raw = [] }
    rows.each do |row|
      intervention = Intervention.new(row)
      study_groups[intervention.nct_id].each do |study|
        study.interventions_raw.push(intervention)
      end
    end
  end

  def extended_interventions
    @extended_interventions || Study.preload_extended_interventions(self)
    @extended_interventions
  end

  def extended_interventions_raw
    @extended_interventions
  end

  def extended_interventions_raw=(value)
    @extended_interventions = value
  end


  def geocode
    facilities.where(country: 'United States').each do |facility|
      facility.geocode
      sleep 0.1
    end
  end

  def self.preload_extended_interventions(studies) # rubocop:disable Metrics/MethodLength
    studies = studies.is_a?(Array) ? studies : [studies]
    study_groups = studies.group_by(&:nct_id)
    ids = studies.map(&:id)
    ids_sql = ids.map { |id| "\'#{id}\'" }.join(",")
    query = <<-SQL
      SELECT dg.group_type as group_type,
        dg.title as group_name,
        dg.description as group_description,
        i.nct_id as nct_id,
        i.name as name,
        i.intervention_type as type,
        i.description as description,
        i.id as id,
        ion.name AS other_name
      FROM interventions i
      LEFT OUTER JOIN intervention_other_names ion
                 ON i.id = ion.intervention_id
      LEFT OUTER JOIN design_group_interventions dgi
                 ON i.id = dgi.intervention_id
      LEFT OUTER JOIN design_groups dg
                 ON dgi.design_group_id = dg.id
      WHERE i.nct_id IN (#{ids_sql})
      ORDER BY dg.group_type
    SQL

    rows = AactRecord.connection.execute(query)
    # Successfully executed sql query - reset extended_inverventions
    studies.each { |study| study.extended_interventions_raw = [] }
    rows.each do |row|
      intervention = ExtendedIntervention.new(row)
      study_groups[intervention.nct_id].each do |study|
        study.extended_interventions_raw.push(intervention)
      end
    end
  end

  def self.enqueue_facilities_geocoding(nct_id)
    Facility.where(nct_id: nct_id).each do |facility|
      Location.find_or_create_by(name: facility.location_name)
    end
  end

  # Takes a selector and enqeueues each instance for batch async reindex
  # Note: selector cannot be ordered and limited in this case, but the query could be big
  # it will be split in batches
  # @param [Study::ActiveRecord_Relation]
  def self.enqueue_reindex_job_big(selector)
    selector.select(:nct_id).find_each(batch_size: 10_000) do |s|
      enqueue_reindex_ids(s.nct_id)
    end
  end

  # Takes a selector and enqeueues each instance for batch async reindex
  # Note: selector can be ordered and limited in this case, but the query will execute
  # in one pass (i.e. recommended to have less than 10_000 items)
  # @param [Study::ActiveRecord_Relation]
  def self.enqueue_reindex_job_small(selector)
    enqueue_reindex_ids(selector.select(:nct_id).map(&:nct_id))
  end

  def self.enqueue_reindex_ids(ids)
    ids = ids.is_a?(Array) ? ids : [ids]
    ids.each do |id|
      Study.search_index.reindex_queue.push(id)
    end
  end
end
