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
  #requires 4 columns per row in csv, nct_id, Type, Value, user_email (to assign edit to, must be a valid user)
  task :csv, [:csv_file] => :environment do |_t, args|
    require File.expand_path("app/services/csv_processor", __dir__)
    errors = []
    to_index = []
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
        to_index.push(row["nct_id"])
        tally = -> {}
        begin
          user = User.find_by(email: row["user_email"])
          if row["Action"] == "Remove"
            params[:delete_meta] = { 
              key: row["Type"],
              value: row["Value"],
            }
            tally = -> { removed_crowd += 1 }
          elsif row['Action'] == 'Add'
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
    Study.enqueue_reindex_ids(to_index.uniq)
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
        s.respond_to?(k.to_sym)
          puts "#{w.nct_id},#{k},#{f[k]}"
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
  task bootstrap: [:create_index, :add_query_studies]

  desc "Creates an index with all studies from sql database"
  task bootstrap_full: [:create_index, :reindex]

  desc "Takes {limit} studies from sql database for '{term}' and upserts them into index"
  task :add_query_studies, [:limit, :term] => :environment do |_t, args|
    args.with_defaults(limit: 1000, term: 'pancreatic neoplasms')
    to_index = args[:limit].to_i
    search_term = args[:term].to_s
    p "Indexing #{to_index} studies searched by #{search_term}"
    
    studies_nct_ids = Study.find_by_sql("
      select s2.nct_id, count(s2.nct_id)
      from
      (
          select s.nct_id, bc.downcase_mesh_term
          from  studies s
          left outer join browse_conditions bc
          on s.nct_id = bc.nct_id
          WHERE bc.downcase_mesh_term like '#{search_term}'
          or s.nct_id in ('NCT01964430','NCT00844649','NCT00112658','NCT02184195')
          order by s.updated_at desc
        
      ) as s2
      group by s2.nct_id, s2.downcase_mesh_term
      order by count(s2.nct_id) DESC
      limit #{to_index}
    ")
    Study.enqueue_reindex_job_small(Study.where("nct_id in (?)", studies_nct_ids.pluck(:nct_id)))
    until Study.search_index.reindex_queue.length == 0
      p "#{Study.search_index.reindex_queue.length} left..."
      sleep 5
    end
    p "Success!"
  end

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

# rubocop:enable Style/ZeroLengthPredicate
