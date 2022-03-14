class OutcomeMeasurement < AactRecord
  include BelongsToStudy

  belongs_to :outcome
  belongs_to :result_group
end
