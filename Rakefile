# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks


namespace :search do

  task :create_index => :environment do
    p "Initializing index..."
    Study.reindex(import: false)
    p "Done!"
  end

  task :reindex => :environment do
    p "Working on #{Study.count} documents..."
    Study.find_each do |study|
      begin
        study.reindex_async
      rescue Redis::CommandError
        p "Reached Redis memory limit, backing off..."
        study.reindex
      rescue StandardError => e
        p "Reached error #{e} -- database may need some space..."
        sleep 30
        retry
      end
    end
    while Study.search_index.reindex_queue.length > 0 do
      p "#{Study.search_index.reindex_queue.length} left..."
      sleep 15
    end
    p "Success!"
  end

  task :reindex_dev, [:limit] => :environment do |t, args|
    args.with_defaults(:limit => 1000)
    to_index = args[:limit].to_i
    p "Indexing #{to_index} random studies"
    Study.limit(to_index).order('random()').map(&:reindex_async)
  end

  task :add_reviews_dev, [:limit] => :environment do |t, args|
    user = User.first
    Study.search('*', limit: args[:limit].to_i).each do |study|
      Review.create(user: user, study: study, rating: Random.rand(5).to_i, comment: "Here is a review")
    end
  end
end
