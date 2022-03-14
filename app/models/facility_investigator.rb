class FacilityInvestigator < AactRecord
  include BelongsToStudy

  belongs_to :facility
end
