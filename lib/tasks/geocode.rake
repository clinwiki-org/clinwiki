namespace :geocode do
  desc "Adds all facilities to the queue to be geocoded. (from US Interventional studies)"
  task queue: :environment do
    facilities = Facility.joins(:study).
                 where(country: 'United States')

    facilities.find_in_batches do |group|
      group.each do |facility|
        Location.find_or_create_by(name: facility.location_name)
      end
    end
  end

  desc "Geocode unchecked locations"
  task process: :environment do
    locations = Location.where(checked: nil)
    locations.each do |location|
      location.geocode
      sleep 0.1
    end
  end

end
