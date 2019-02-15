class Facility < AactRecord
  include BelongsToStudy

  has_many :facility_contacts, dependent: :restrict_with_exception
  has_many :facility_investigators, dependent: :restrict_with_exception

  def description
    "#{country}: #{name}, #{city} #{state} #{zip} (#{recruitment_status})"
    #  Some studies have thousands and it takes too long to query each contact
    #  "#{country}: #{name}, #{city} #{state} #{zip} #{primary_contact} (#{recruitment_status})"
  end

  def recruitment_status
    status.presence || "status unknown"
  end

  def primary_contact
    # facility_contacts.select{|fc|fc.contact_type.downcase=='primary'}.first.try(:contact_info)
  end
end
