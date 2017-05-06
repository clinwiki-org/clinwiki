class Study < AactBase
  self.primary_key = 'nct_id'

  attr :average_rating

  searchkick batch_size: 25, callbacks: :async

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
  has_many :annotations,      :foreign_key => 'nct_id'
  has_many :tags,             :foreign_key => 'nct_id'

  scope :find_by_term, lambda {|term| where("nct_id in (select nct_id from ids_for_term(?))", "%#{term}%")}

  def init_annotations
    annotations << Annotation.init_lay_summary
  end

  def average_rating
    @average_rating ||= reviews.size == 0 ? 0 : reviews.average(:rating).round(2)
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

  def crowd_source_info
    annotations.each {|annotation|
      {:label=>annotation.label,:value=>annotation.description}
    }
  end

  scope :search_import, -> {
    includes(:brief_summary, :detailed_description, :browse_conditions, :reviews,
    :browse_interventions, :interventions, :design_outcomes, :facilities)
  }

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
      average_rating: average_rating,
      })
  end

end
