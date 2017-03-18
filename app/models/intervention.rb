class Intervention < Aact
  has_many :intervention_other_names, inverse_of: :intervention
  has_many :design_group_interventions,  inverse_of: :intervention
  has_many :design_groups, :through => :design_group_interventions
end
