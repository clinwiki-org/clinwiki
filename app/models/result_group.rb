class ResultGroup < Aact

  has_many :reported_events
  has_many :milestones
  has_many :drop_withdrawals
  has_many :baseline_measures
  has_many :outcome_counts
  has_many :outcome_measurements
  has_many :outcome_analysis_groups, inverse_of: :result_group
  has_many :outcome_analyses, :through => :outcome_analysis_groups

end
