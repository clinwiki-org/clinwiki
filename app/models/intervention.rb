class Intervention < AactRecord
  include BelongsToStudy

  has_many :intervention_other_names, inverse_of: :intervention, dependent: :restrict_with_exception
  has_many :design_group_interventions, inverse_of: :intervention, dependent: :restrict_with_exception
  has_many :design_groups, through: :design_group_interventions, dependent: :restrict_with_exception
end
