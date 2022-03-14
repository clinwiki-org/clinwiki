class OutcomeAnalysis < AactRecord
  include BelongsToStudy

  belongs_to :outcome, inverse_of: :outcome_analyses
  has_many   :outcome_analysis_groups, inverse_of: :outcome_analysis, dependent: :restrict_with_exception
  has_many   :result_groups, through: :outcome_analysis_groups

  def groups
    outcome_analysis_groups
  end
end
