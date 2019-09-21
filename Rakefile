# rubocop:disable Style/ZeroLengthPredicate
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path("config/application", __dir__)

Rails.application.load_tasks

task :token, [:email] => :environment do |_t, args|
  user = args[:email] ? User.find_by(email: args[:email]) : User.first
  if user.blank?
    p "User not found"
    return
  end

  hmac_secret = Rails.application.secrets.secret_key_base
  raise "SECRET_KEY_BASE is not set" if hmac_secret.blank?

  exp_secs = 86_400 * 30
  exp = Time.now.to_i + exp_secs.to_i
  jwt = JWT.encode({ email: user.email, exp: exp }, hmac_secret, "HS256")

  puts jwt
end

namespace :import do
  task :csv, [:csv_file] => :environment do |_t, args|
    require File.expand_path("app/services/csv_processor", __dir__)
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
    CSV.open(fname, "r:bom|utf-8", headers: :first_row) do |csv|
      csv.each do |row|
        service = CSVProcessorService.new
        params = { study_id: row["nct_id"] }
        tally = -> {}
        begin
          if row["Type"] == "Tag"
            tags = row["Value"].split("|")
            if row["Action"] == "Add"
              params[:add_tag] = tags
              tally = -> { added_tags += tags.length }
            elsif row["Action"] == "Remove"
              params[:remove_tag] = tags
              tally = -> { removed_tags += tags.length }
            else
              raise "Action #{row['Action']} unsupported"
            end
          elsif row["Action"] == "Remove"
            params[:delete_meta] = { key: row["Type"] }
            tally = -> { removed_crowd += 1 }
          else
            params[:add_meta] = {
              key: row["Type"],
              value: row["Value"],
            }
            tally = -> { added_crowd += 1 }
          end
          tally.call
          service.create_or_update_wiki_page_for_study(params: params, user: user)
        rescue StandardError => e
          errors << { nct_id: row["nct_id"], error: e }
        end
      end
    end
    p "#{added_tags} added tags"
    p "#{removed_tags} removed tags"
    p "#{added_crowd} added crowd entries"
    p "#{removed_crowd} removed crowd entries"
    p "#{errors.size} errors:"
    p errors unless errors.empty?
  end
end

namespace :export do
  task front_matter_csv: :environment do
    ActiveRecord::Base.logger = nil
    s = Study.new
    puts "nct_id,Type,Value"
    WikiPage.find_each do |w|
      f = w.front_matter
      next if f.blank?

      f.keys.each do |k|
        if k == "tags"
          puts "#{w.nct_id},Tags,#{f[k].join('|')}"
        elsif s.respond_to?(k.to_sym)
          puts "#{w.nct_id},#{k},#{f[k]}"
        end
      end
    end
  end
end

namespace :search do
  desc "Creates an empty index"
  task create_index: :environment do
    p "Initializing index..."
    Study.reindex(import: false)
    p "Done!"
  end

  desc "Upserts recent studies from x days ago (1 day by default)"
  task :reindex_days_ago, [:days] => :environment do |_t, args|
    args.with_defaults(days: 1)
    p "Getting ids of studies updated less than #{args[:days].to_i + 1} ago"
    Study.enqueue_reindex_job_big(Study.where("updated_at > ?", args[:days].to_i.days.ago))
    until Study.search_index.reindex_queue.length == 0
      p "#{Study.search_index.reindex_queue.length} left..."
      sleep 5
    end
    p "Success!"
  end

  desc "Takes all studies from sql database and upserts them into index"
  task reindex: :environment do
    p "Getting ids of #{Study.count} documents..."
    Study.enqueue_reindex_job_big(Study.all)
    until Study.search_index.reindex_queue.length == 0
      p "#{Study.search_index.reindex_queue.length} left..."
      sleep 5
    end
    p "Success!"
  end

  desc "Takes random {limit} studies from sql database and upserts them into index"
  task :add_random_studies_to_index, [:limit] => :environment do |_t, args|
    args.with_defaults(limit: 1000)
    to_index = args[:limit].to_i
    p "Indexing #{to_index} random studies"
    Study.enqueue_reindex_job_small(Study.limit(to_index).order(Arel.sql("random()")))
    until Study.search_index.reindex_queue.length == 0
      p "#{Study.search_index.reindex_queue.length} left..."
      sleep 5
    end
    p "Success!"
  end

  desc "Updates all records in the index"
  task update_index: :environment do
    page = 0
    while page
      search = Study.search(load: false, per_page: 1_000, page: page)
      page = search.next_page
      ids = search.results.map(&:id)
      Study.enqueue_reindex_ids(ids)
    end
    until Study.search_index.reindex_queue.length == 0
      p "#{Study.search_index.reindex_queue.length} left..."
      sleep 5
    end
    p "Success!"
  end

  desc "Creates an index with 1000 random studies"
  task bootstrap: [:create_index, :add_random_studies_to_index]

  desc "Creates an index with all studies from sql database"
  task bootstrap_full: [:create_index, :reindex]

  # task :add_reviews_dev, [:limit] => :environment do |t, args|
  #   args.with_defaults(:limit => 250)
  #   user = User.first
  #   Study.limit(args[:limit]).order('random()').each do |study|
  #     Review.create(
  #     user: user, study: study, rating: Random.rand(5).to_i,
  #     comment:
  #       ["Good study", "Terrible side effects!", "Incorrect study design", "More like triple-blind"].shuffle.first)
  #   end
  # end

  # task :add_tags_dev, [:limit] => :environment do |t, args|
  #   args.with_defaults(:limit => 100)
  #   user = User.first
  #   Study.limit(args[:limit]).order('random()').each do |study|
  #     Tag.create(user: user, study: study, value: ['tag a', 'tag b', 'tag c', 'tag d'].shuffle.first)
  #   end
  # end

  # task :delete_unused_fields => :environment do
  #   Study::NON_INDEX_FIELDS.each do |field|
  #     puts field
  #     puts Searchkick.client.update_by_query(
  #       index: "_all",
  #       wait_for_completion: false,
  #       body: {
  #         script: "ctx._source.remove(\"#{field}\")"
  #         })
  #   end
  # end
end

desc "Creates an index with all studies from sql database"
task migrate_tags: :environment do
  updater = User.first
  WikiPage.all.each do |wiki_page|
    next unless wiki_page.tags.is_a?(Array)

    fm = wiki_page.front_matter
    fm["tags"] = fm["tags"].join("|")
    wiki_page.front_matter = fm
    wiki_page.updater = updater
    wiki_page.save!
    p "Successfully migrated tags for wiki `#{wiki_page.nct_id}`"
  end
end

namespace :autocomplete do
  desc "Creates an index of the WordFrequency table"
  task reindex: :environment do
    p "Initializing index..."
    WordFrequency.reindex
    p "Done!"
  end


  desc "Creates seed for WordFreq table from Study"
  task seed: :environment do

    # Since we're seeding from scratch, destroy the original db and recreate it.
    # using delete_all instead of destroy_all for efficiency (since there's no callbacks here)
    WordFrequency.delete_all
    # Using default batch memory size of 1000 since that's a pretty reasonable amount 
    # to conserve memory by
    Study.find_in_batches do |studies_sub|
      #To save memory use a new hash every 1000 records being iterated upon
      hash = Hash.new(0)
      studies_sub.each do |study|
        title_array = study.brief_title.split(' ')
        title_array.each do |word|
          # delete any characters that are not letters or hyphens or apostrophes or numbers.
          sanitized = word.delete("^a-zA-Z-'0-9")
          # if the word is a whole word, hyphenated, or has an apostrophe
          # AND it's not only digits
          if sanitized =~ /^[a-zA-Z0-9]+(?:['-]*[a-zA-Z0-9]+)*$/ and sanitized !~ /^\d+$/
            # if the word doesn't have an apostrophe and it doesn't have two capital letters,
            # or if it has two capitalized words separated by a hyphen
            # or if it already exists in the hash as downcased
            if sanitized !~ /'/ and sanitized !~ /.*[A-Z].*[A-Z].*/ or
                sanitized =~ /^[A-Z][a-z]*-[A-Z][a-z]*$/ or
                hash.key?(name: sanitized.downcase)
              sanitized = sanitized.downcase
            end
            hash[sanitized] += 1
          end
        end
      end

      hash = hash.select{|k, _| !FUNCTION_WORDS.include? k}

      hash.each_pair do |word, word_count| 
        WordFrequency.find_or_create_by(name: word) do |record|
          record.frequency = (record.frequency || 0) + word_count
        end
      end
    end       
  end

  desc "Creates an index with all words from sql database"
  task bootstrap: [:seed, :reindex]

end

# rubocop:enable Style/ZeroLengthPredicate
