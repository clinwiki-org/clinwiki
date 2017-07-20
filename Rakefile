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

  task :reindex_days_ago, [:days] => :environment do |t, args|
    args.with_defaults(:days => 1)
    p "Reindexing updates from #{args[:days]} ago"
    AactSync.perform_async({ "days_ago" => args[:days] })
  end

  task :reindex => :environment do
    p "Working on #{Study.count} documents..."
    Study.enqueue_reindex_job(Study.all)
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
    Study.enqueue_reindex_job(Study.limit(to_index).order('random()'))
  end

  task :add_reviews_dev, [:limit] => :environment do |t, args|
    args.with_defaults(:limit => 250)
    user = User.first
    Study.limit(args[:limit]).order('random()').each do |study|
      Review.create(
      user: user, study: study, rating: Random.rand(5).to_i,
      comment: ["Good study", "Terrible side effects!", "Incorrect study design", "More like triple-blind"].shuffle.first)
    end
  end

  task :add_tags_dev, [:limit] => :environment do |t, args|
    args.with_defaults(:limit => 100)
    user = User.first
    Study.limit(args[:limit]).order('random()').each do |study|
      Tag.create(user: user, study: study, value: ['tag a', 'tag b', 'tag c', 'tag d'].shuffle.first)
    end
  end

  task :bootstrap_dev => [:create_index, :reindex_dev, :add_tags_dev, :add_reviews_dev]

end
