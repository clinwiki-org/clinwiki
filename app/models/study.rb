class Study < AactBase
  self.primary_key = 'nct_id'

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
  has_many :tags,             :foreign_key => 'nct_id'

  scope :find_by_term, lambda {|term| joins(:browse_conditions,:browse_interventions,:keywords).where("browse_conditions.mesh_term like ? or browse_interventions.mesh_term like ? or keywords.name like ? ", "%#{term}%","%#{term}%","%#{term}%").uniq}

  def average_rating
    reviews.size == 0 ? 0 : reviews.average(:rating).round(2)
  end

  def display_start_date
    start_date.to_date.strftime('%B %Y') if start_date
  end

end
