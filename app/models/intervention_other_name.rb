class InterventionOtherName < Aact
  belongs_to :intervention, inverse_of: :intervention_other_names
end
