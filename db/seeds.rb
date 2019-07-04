# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
User.create! first_name: "Sheri", last_name: "Tibbs", email: "sheri.tibbs@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki"
User.create! first_name: "William", last_name: "Hoos", email: "william.hoos@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki"

# WordFrequency.create! name: "cancer", frequency: 10, rank: 1
# WordFrequency.create! name: "test", frequency: 5, rank: 2
# WordFrequency.create! name: "kidney", frequency: 3, rank: 3
# WordFrequency.create! name: "lung", frequency: 2, rank: 4
# WordFrequency.create! name: "prostate", frequency: 1, rank: 5

studies = Study.order('RANDOM()').first(50)
hash = Hash.new(0)
studies.each do |study|
  title_array = study.brief_title.split(' ')

  title_array.each do |word|
    sanitized = word.delete("^a-zA-Z-").downcase
    # this regex disallows 1-letter words, which is unintended,
    # but 1-letter words are relatively useless for the autosuggest anyway
    # change this if necessary
    if sanitized =~ /^[a-zA-Z]+(?:['-]*[a-zA-Z]+)*$/
      hash[sanitized] += 1
    end
  end
end
hash.each_pair do |word, word_count|
  WordFrequency.create! name: word, frequency: word_count
end

WordFrequency.order(frequency: :desc).all.each do |x|
  puts x.name + ' ' + x.frequency.to_s
end


