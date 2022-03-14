class DesignGroup < AactRecord
  include BelongsToStudy

  has_many :design_group_interventions, inverse_of: :design_group, dependent: :restrict_with_exception
  has_many :interventions, through: :design_group_interventions
end
