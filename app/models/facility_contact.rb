class FacilityContact < Aact
  belongs_to :facility

  def contact_info
    "#{name} #{email} #{phone}"
  end

end
