# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks


namespace :search do
  task :index => :environment do
    index_name = Study.reindex(async: true)[:index_name]
    p "Working on #{index_name}"
    result = Searchkick.reindex_status(index_name)
    while !result[:completed] do
      p "#{result[:batches_left]} batches left..."
      sleep 15
      result = Searchkick.reindex_status(index_name)
    end
    p "Promoting index #{index_name}"
    Study.search_index.promote(index_name)
    p "Success!"
  end

  task :reindex_dev, [:limit] => :environment do |t, args|
    args.with_defaults(:limit => 1000)
    to_index = args[:limit].to_i
    p "Indexing #{to_index} random studies"
    Study.limit(to_index).order('random()').map(&:reindex_async)
  end

end
