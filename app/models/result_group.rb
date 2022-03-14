class ResultGroup < AactRecord
  include BelongsToStudy

  has_many :reported_events, dependent: :restrict_with_exception
  has_many :milestones, dependent: :restrict_with_exception
  has_many :drop_withdrawals, dependent: :restrict_with_exception
  has_many :baseline_measures, dependent: :restrict_with_exception
  has_many :outcome_counts, dependent: :restrict_with_exception
  has_many :outcome_measurements, dependent: :restrict_with_exception
  has_many :outcome_analysis_groups, inverse_of: :result_group, dependent: :restrict_with_exception
  has_many :outcome_analyses, through: :outcome_analysis_groups
end
