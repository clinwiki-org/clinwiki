namespace :geocode do
  desc "Adds all facilities to the queue to be geocoded. (from US Interventional studies)"
  task :queue, [:days] => :environment do |_t, args|
    studies = Study.where("updated_at > ?", args[:days].to_i.days.ago)
    if studies.length > 4_000
      facilities = Facility.joins(:study).
                   where(country: 'United States')

      facilities.find_in_batches do |group|
        group.each do |facility|
          Location.find_or_create_by(name: facility.location_name)
        end
      end
    else
      studies.find_in_batches do |group|
        group.each do |study|
          Study.enqueue_facilities_geocoding(study.nct_id)
        end
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
