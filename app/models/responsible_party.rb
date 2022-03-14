class ResponsibleParty < AactRecord
  include BelongsToStudy

  def type
    responsible_party_type
  end
end
