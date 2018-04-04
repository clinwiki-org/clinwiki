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
    added_crowd = 0
    removed_crowd = 0
    fname = "imports/#{args[:csv_file]}"
    p "running on #{fname}"
    CSV.foreach(fname, headers: :first_row) do |row|
      service = CSVProcessorService.new
      params = { study_id: row["nct_id"], }
      tally = lambda {}
      begin
        if row["Type"] == 'Tag'
          tags = row["Value"].split('|')
          if row["Action"] == 'Add'
            params[:add_tag] = tags
            tally = lambda { added_tags += tags.length }
          elsif row["Action"] == 'Remove'
            params[:remove_tag] = tags,
            tally = lambda { removed_tags += tags.length }
          else
            raise "Action #{row["Action"]} unsupported"
          end
        elsif Study.new.respond_to?(row["Type"].to_sym)
          if row["Action"] == 'Remove'
            params[:delete_meta] = { key: row["Type"] }
            tally = lambda { removed_crowd += 1 }
          else
            params[:add_meta] = {
              key: row["Type"],
              value: row["Value"],
            }
            tally = lambda { added_crowd += 1}
          end
        else
          raise "Type #{row["Type"]} unsupported"
        end
        tally.call
        service.create_or_update_wiki_page_for_study(params: params, user: user)
      rescue StandardError => e
        errors << { nct_id: row["nct_id"], error: e }
      end
    end
    p "#{added_tags} added tags"
    p "#{removed_tags} removed tags"
    p "#{added_crowd} added crowd entries"
    p "#{removed_crowd} removed crowd entries"
    p "#{errors.size} errors:"
    p errors if errors.size > 0
  end
end

namespace :export do
  task :front_matter_csv => :environment do
    ActiveRecord::Base.logger = nil
    s = Study.new
    puts "nct_id,Type,Value"
    WikiPage.find_each do |w|
      f = w.front_matter
      next if f.blank?
      f.keys.each do |k|
        if k == 'tags'
          puts "#{w.nct_id},Tags,#{f[k].join("|")}"
        elsif s.respond_to?(k.to_sym)
          puts "#{w.nct_id},#{k},#{f[k]}"
        end
      end
    end
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
