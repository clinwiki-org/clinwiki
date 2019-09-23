class WordFrequency < ApplicationRecord
  searchkick word_start: [:name], callbacks: :queue, batch_size: 25
  include Sidekiq::Worker
  sidekiq_options retry: false

  self.primary_key = "name"

  def total_frequency
    WordFrequency.sum(:frequency)
  end

  def percentage(word)
    WordFrequency.where(:name => word).frequency / total_frequency
  end

  def self.reindex_model(promote_and_clean=true)
    puts "Reindexing Word Frequency ..." 
    index = WordFrequency.reindex(async: true, refresh_interval: '30s')
    puts "All jobs are in queue. Index name: #{index[:index_name]}"
    loop do
      queue_size = Sidekiq::Queue.new('searchkick').size
      puts "Jobs left: #{queue_size}"
      sleep 5
      break if queue_size.zero?
    end
    puts 'Jobs complete. Promoting...'
    promote_and_clean(index) if promote_and_clean
  end
  
  def self.reindex_small(promote_and_clean=true)
    puts "Reindexing Word Frequency ..." 
    index = WordFrequency.reindex(async:  true, refresh_interval: '30s')
    puts 'Jobs complete. Promoting...'
    promote_and_clean(index) if promote_and_clean
  end

  def self.promote_and_clean(index)
    WordFrequency.search_index.promote(index[:index_name], update_refresh_interval:true)
    puts 'Reindex of WordFrequency complete'
    puts 'Cleaning old indices'
    WordFrequency.search_index.clean_indices
    puts 'Done!'
  end

  def self.seed(size=1000)
    #deletes all records of WordFrequency so we have a fresh db
    WordFrequency.delete_all

    #batch size of 1000 is default and pretty reliable
    Study.limit(size).find_in_batches(batch_size: 1000) do |studies|
      hash = Hash.new(0)
      studies.each do |study|
        study.brief_title.split(' ').each do |word|
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
                hash.key?(sanitized.downcase)
              sanitized = sanitized.downcase
            end
            hash[sanitized] += 1
          end
        end  
      end

      columns = [:name, :frequency]
      values = hash.select{|k, _| !FUNCTION_WORDS.include? k}.to_a

      #throws whole hash into WordFrequency using import to avoid N+1 query problem
      WordFrequency.import columns, values, on_duplicate_key_update: "frequency = word_frequencies.frequency+excluded.frequency"
    end

  end

  def self.seed_random(size=1000)
    WordFrequency.delete_all
    studies = Study.order('RANDOM()').first(1000)
    hash = Hash.new(0)
    studies.each do |study|
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
              hash.key?(sanitized.downcase)
            sanitized = sanitized.downcase
          end
          hash[sanitized] += 1
        end
      end
    end


    columns = [:name, :frequency]
    values = hash.select{|k, _| !FUNCTION_WORDS.include? k}.to_a

    #throws whole hash into WordFrequency using import to avoid N+1 query problem
    WordFrequency.import columns, values


  end

  #
  # def rank(word)
  #   WordFrequency.all.order(frequency: :desc).map(&:name).index(word) + 1
  # end
end
