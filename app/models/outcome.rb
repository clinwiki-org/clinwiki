class Outcome < AactRecord
  include BelongsToStudy

  has_many :outcome_counts, inverse_of: :outcome, dependent: :restrict_with_exception
  has_many :outcome_analyses, inverse_of: :outcome, dependent: :restrict_with_exception
  has_many :outcome_measurements, inverse_of: :outcome, dependent: :restrict_with_exception
end
