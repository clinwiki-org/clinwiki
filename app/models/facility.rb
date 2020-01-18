class Facility < AactRecord
  include BelongsToStudy

  has_many :facility_contacts, dependent: :restrict_with_exception
  has_many :facility_investigators, dependent: :restrict_with_exception

  # belongs_to :facility_location, foreign_key: [:name, :city, :state, :zip, :country]
  def facility_location
    return @facility_location if @facility_location
    @facility_location = FacilityLocation.find_by(
      name: name, city: city, state: state, zip: zip, country: country
    )
  end

  def facility_location=(val)
    @facility_location = val
  end

  # this runs the geocoding algorithm
  # 1. attempt with "name, city state zip country"
  # 2. if no partial match => status: good
  # 3. if partial match attempt with "city state zip country"
  # 4. if no partial match => status: zip
  # 5. if partial match => status: bad
  def geocode
    unless facility_location
      self.facility_location = FacilityLocation.new(
        name: name,
        city: city,
        state: state,
        zip: zip,
        country: country
      )
    end

    full_name = "#{name}, #{city} #{state} #{zip} #{country}"
    location = Location.find_or_create_by(name: full_name)
    location.geocode unless location.checked

    if location.partial_match
      zip_name = "#{city} #{state} #{zip} #{country}"
      zip = Location.find_or_create_by(name: zip_name)
      zip.geocode unless zip.checked

      if zip.partial_match
        facility_location.update(
          latitude: nil,
          longitude: nil,
          status: 'bad'
        )
      else
        facility_location.update(
          latitude: zip.latitude,
          longitude: zip.longitude,
          status: 'zip'
        )
      end
    else
      facility_location.update(
        latitude: location.latitude,
        longitude: location.longitude,
        status: 'good'
      )
    end
  end

  def location_name
    "#{name}, #{city} #{state} #{zip} #{country}"
  end

  def location
    return @location if @location
    @location = Location.find_or_create_by(name: location_name)
  end

  def latitude
    return nil if location.partial_match
    location.latitude
  end

  def longitude
    return nil if location.partial_match
    location.longitude
  end

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
