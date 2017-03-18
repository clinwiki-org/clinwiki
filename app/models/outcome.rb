class Outcome < Aact
  has_many :outcome_counts, inverse_of: :outcome
  has_many :outcome_analyses, inverse_of: :outcome
  has_many :outcome_measurements, inverse_of: :outcome
end
