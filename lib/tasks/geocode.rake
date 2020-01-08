namespace :geocode do
  desc "Adds all facilities to the queue to be geocoded. (from US Interventional studies)"
  task :process, [:days] => :environment do |_t, args|
    studies = Study.where("updated_at > ?", args[:days].to_i.days.ago)
    if studies.length > 4_000
      facilities = Facility.joins(:study).where(country: 'United States')
      facilities.find_in_batches do |group|
        group.each do |facility|
          facility.geocode
          sleep 0.1
        end
      end
    else # only geocode updated studies
      studies.find_in_batches do |group|
        group.each do |study|
          study.geocode
        end
      end
    end
  end
end
