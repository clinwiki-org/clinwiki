# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

namespace :import do
  task :csv, [:csv_file] => :environment do |t, args|
    require File.expand_path('../app/services/csv_processor', __FILE__)
    user = User.find_by(email: "no-reply@clinwiki.org")
    if user.nil?
      user = User.create(
        email: "no-reply@clinwiki.org",
        first_name: "Clinwiki",
        last_name: "Bot",
      )
    end
    errors = []
    added_tags = 0
    removed_tags = 0
    fname = "imports/#{args[:csv_file]}"
    p "running on #{fname}"
    CSV.foreach(fname, headers: :first_row) do |row|
      service = CSVProcessorService.new
      begin
        if row["Type"] == 'Tag'
          p 'here'
          tags = row["Value"].split('|')
          if row["Action"] == 'Add'
            p 'adding'
            service.create_or_update_wiki_page_for_study(params: {
                study_id: row["nct_id"],
                add_tag: tags,
              }, user: user)
            added_tags += tags.length
          elsif row["Action"] == 'Remove'
            service.create_or_update_wiki_page_for_study(params: {
                study_id: row["nct_id"],
                remove_tag: tags,
              }, user: user)
            removed_tags += tags.length
          else
            raise "Action #{row["Action"]} unsupported"
          end
        else
          raise "Type #{row["Type"]} unsupported"
        end

      rescue StandardError => e
        errors << { nct_id: row["nct_id"], error: e }
      end
    end
    p "#{added_tags} added tags"
    p "#{removed_tags} removed tags"
    p "#{errors.size} errors:"
    p errors if errors.size > 0
  end
end


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

  task :delete_unused_fields => :environment do
    Study::NON_INDEX_FIELDS.each do |field|
      puts field
      puts Searchkick.client.update_by_query(
        index: "_all",
        wait_for_completion: false,
        body: {
          script: "ctx._source.remove(\"#{field}\")"
          })
    end
  end

end
