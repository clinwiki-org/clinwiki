class Study < AactBase
  self.primary_key = 'nct_id'

  attr :average_rating

  attr :excluded_wiki_data

  searchkick callbacks: :queue, batch_size: 25

  has_one :wiki_page, :foreign_key => 'nct_id'

  has_one  :brief_summary,         :foreign_key => 'nct_id'
  has_one  :design,                :foreign_key => 'nct_id'
  has_one  :detailed_description,  :foreign_key => 'nct_id'
  has_one  :eligibility,           :foreign_key => 'nct_id'
  has_one  :participant_flow,      :foreign_key => 'nct_id'
  has_one  :calculated_value,      :foreign_key => 'nct_id'

  has_many :baseline_measurements, :foreign_key => 'nct_id'
  has_many :baseline_counts,       :foreign_key => 'nct_id'
  has_many :browse_conditions,     :foreign_key => 'nct_id'
  has_many :browse_interventions,  :foreign_key => 'nct_id'
  has_many :central_contacts,      :foreign_key => 'nct_id'
  has_many :conditions,            :foreign_key => 'nct_id'
  has_many :countries,             :foreign_key => 'nct_id'
  has_many :design_outcomes,       :foreign_key => 'nct_id'
  has_many :design_groups,         :foreign_key => 'nct_id'
  has_many :design_group_interventions, :foreign_key => 'nct_id'
  has_many :drop_withdrawals,      :foreign_key => 'nct_id'

  has_many :facilities,            :foreign_key => 'nct_id'
  has_many :facility_contacts,     :foreign_key => 'nct_id'
  has_many :facility_investigators,:foreign_key => 'nct_id'
  has_many :id_information,        :foreign_key => 'nct_id'
  has_many :interventions,         :foreign_key => 'nct_id'
  has_many :intervention_other_names, :foreign_key => 'nct_id'
  has_many :keywords,              :foreign_key => 'nct_id'
  has_many :links,                 :foreign_key => 'nct_id'
  has_many :milestones,            :foreign_key => 'nct_id'
  has_many :outcomes,              :foreign_key => 'nct_id'
  has_many :outcome_analysis_groups, :foreign_key => 'nct_id'
  has_many :outcome_analyses,      :foreign_key => 'nct_id'
  has_many :outcome_measurements,  :foreign_key => 'nct_id'
  has_many :overall_officials,     :foreign_key => 'nct_id'
  has_many :references,            :foreign_key => 'nct_id'
  has_many :reported_events,       :foreign_key => 'nct_id'
  has_many :responsible_parties,   :foreign_key => 'nct_id'
  has_many :result_agreements,     :foreign_key => 'nct_id'
  has_many :result_contacts,       :foreign_key => 'nct_id'
  has_many :result_groups,         :foreign_key => 'nct_id'
  has_many :sponsors,              :foreign_key => 'nct_id'

  # clinwiki relationships
  has_many :reviews,          :foreign_key => 'nct_id'

  scope :find_by_term, lambda {|term| where("nct_id in (select nct_id from ids_for_term(?))", "%#{term}%")}

  def average_rating
    @average_rating ||= reviews.size == 0 ? 0 : reviews.average(:overall_rating).round(2)
  end

  def display_start_date
    start_date.to_date.strftime('%B %Y') if start_date
  end

  def display_interventions
    res=Study.connection.execute("select intervention from all_interventions where nct_id='#{nct_id}'")
    if !res.first.nil?
      res.first['intervention']
    end
  end

  def display_conditions
    res=Study.connection.execute("select mesh_term from all_conditions where nct_id='#{nct_id}'")
    if !res.first.nil?
      res.first['mesh_term']
    end
  end

  def primary_outcomes
    design_outcomes.select{|o|o.type.downcase=='primary'}
  end

  def secondary_outcomes
    design_outcomes.select{|o|o.type.downcase=='secondary'}
  end

  def primary_outcome_measures
    primary_outcomes.collect{|d| d.display_outcome}.join('; ')
  end

  def secondary_outcome_measures
    secondary_outcomes.collect{|d| d.display_outcome}.join('; ')
  end

  def is_fda_regulated_product?
    is_fda_regulated_device or is_fda_regulated_drug
  end

  def administrative_info
    [
      {:label=>'NCT Number',:value=>nct_id},
      {:label=>'Other Study ID Numbers',:value=>'tbd'},
      {:label=>'Has Data Monitoring Committee',:value=>has_dmc},
      {:label=>'Is FDA-Regulated Product',:value=>is_fda_regulated_product?},
      {:label=>'Plan to Share Data',:value=>plan_to_share_ipd},
      {:label=>'IPD Description',:value=>plan_to_share_ipd_description},
      {:label=>'Responsible Party',:value=>'tbd'},
      {:label=>'Sponsor',:value=>'tbd'},
      {:label=>'Collaborators',:value=>'tbd'},
      {:label=>'Investigators',:value=>'tbd'},
      {:label=>'Information Provided By',:value=>source},
      {:label=>'Verification Date',:value=>verification_date},
    ]
  end

  def tracking_info
    [
      {:label=>'first_received_date',:value=>first_received_date},
      {:label=>'last_changed_date',:value=>last_changed_date},
      {:label=>'start_date',:value=>start_date},
      {:label=>'primary_completion_date',:value=>primary_completion_date},
      {:label=>'primary outcome measures',:value=>primary_outcome_measures},
      {:label=>'secondary outcome measures',:value=>secondary_outcome_measures},
    ]
  end

  def descriptive_info
    [
      {:label=>'brief title',:value=>brief_title},
      {:label=>'official title',:value=>official_title},
      {:label=>'brief summary',:value=>brief_summary.description},
      {:label=>'detailed description',:value=>detailed_description.try(:description)},
      {:label=>'study type',:value=>study_type},
      {:label=>'study phase',:value=>phase},
      {:label=>'study design',:value=>'tbd'},
      {:label=>'conditions',:value=>display_conditions},
      {:label=>'study arms',:value=>'tbd'},
      {:label=>'publications',:value=>'tbd'},
    ]
  end

  def recruitment_info
    [
      {:label=>'recruitment status',:value=>overall_status},
      {:label=>'enrollment',:value=>enrollment},
      {:label=>'completion date',:value=>completion_date},
      {:label=>'primary completion date',:value=>primary_completion_date},
      {:label=>'eligibility criteria',:value=>eligibility.criteria},
      {:label=>'gender',:value=>eligibility.gender},
      {:label=>'ages',:value=>'tbd'},
      {:label=>'accepts healthy volunteers',:value=>eligibility.healthy_volunteers},
      {:label=>'contacts',:value=>'tbd'},
      {:label=>'listed location countries',:value=>'tbd'},
      {:label=>'removed location countries',:value=>'tbd'},
    ]
  end

  scope :search_import, -> {
    includes(:brief_summary, :detailed_description, :browse_conditions, :reviews,
    :browse_interventions, :interventions, :design_outcomes, :facilities,
    :sponsors, :wiki_page)
  }

  # Takes a selector and enqeueues each instance for batch async reindex
  # @param [Study::ActiveRecord_Relation]
  def self.enqueue_reindex_job(selector)
    selector.select(:nct_id).find_each do |s|
      Searchkick.redis.lpush "searchkick:reindex_queue:studies_#{Rails.env}", s.nct_id
    end
  end

  def tags
    try(:wiki_page).try(:tags)
  end

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
    Hash[rating_dimensions.map{|key, vals| [key, vals.inject{ |sum, el| sum + el }.to_f / vals.size]}]
  end

  # Defines the fields to be indexed by searchkick
  # @return [Hash]
  def search_data
    attributes.merge({
      brief_summary: brief_summary && brief_summary.description,
      detailed_description: detailed_description && detailed_description.description,
      browse_condition_mesh_terms: browse_conditions.map(&:mesh_term),
      browse_interventions_mesh_terms: browse_interventions.map(&:mesh_term),
      interventions: interventions.map(&:description),
      design_outcome_measures: design_outcomes.map(&:measure),
      facility_names: facilities.map(&:name),
      facility_states: facilities.map(&:state),
      facility_cities: facilities.map(&:city),
      average_rating: average_rating,
      tags: tags,
      reviews: reviews && reviews.map(&:text),
      sponsors: sponsors && sponsors.map(&:name),
      wiki_text: wiki_page  && wiki_page.text,  # for now, just parse the markdown
      rating_dimensions: rating_dimensions.keys,
    }).merge(average_rating_dimensions)
  end

  # manually publish to reindex queue
  def enqueue_reindex_job
    Searchkick.redis.lpush "searchkick:reindex_queue:studies_#{Rails.env}", nct_id
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
      title: brief_title,
      study_type: with_wiki_data(:study_type),
      overall_status: with_wiki_data(:overall_status),
      phase: phase,
      primary_completion_date: with_wiki_data(:primary_completion_date),
      enrollment: enrollment,
      enrollment_type: enrollment_type,
      source: source,
      tags: tags,
      reviews_length: reviews.count,
      average_rating: average_rating
    }
  end

end
