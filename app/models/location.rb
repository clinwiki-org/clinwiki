class Location < ApplicationRecord
  reverse_geocoded_by 'latitude', 'longitude'

  def geocode
    begin
      res = Geocoder.search(name).first
    rescue Exception => error
      Rails.logger.debug("Error geocoding: \"#{name}\" #{error.message}")
      update(last_error: error.message)
    end
    if res
      update(
        latitude: res&.coordinates.first,
        longitude: res&.coordinates.last,
        partial_match: res&.partial_match,
        location_type: res&.types,
        checked: Time.now
      )
    else
      update(checked: Time.now, location_type: ['note found'], partial_match: true)
    end
  end
end
