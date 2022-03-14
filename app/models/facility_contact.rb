class FacilityContact < AactRecord
  include BelongsToStudy

  belongs_to :facility

  def contact_info
    "#{name} #{email} #{phone}"
  end
end
