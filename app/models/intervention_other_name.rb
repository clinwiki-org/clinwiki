class InterventionOtherName < AactRecord
  include BelongsToStudy

  belongs_to :intervention, inverse_of: :intervention_other_names
end
