class Location < ApplicationRecord

  def geocode
    res = Geocoder.search(name).first
    if res
      update(
        latitude: res&.coordinates.first,
        longitude: res&.coordinates.last,
        partial_match: res&.partial_match,
        location_type: res&.types,
        checked: Time.now
      )
    else
      update(checked: Time.now)
    end
  end
end
