# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
User.create! first_name: "Sheri", last_name: "Tibbs", email: "sheri.tibbs@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki"
User.create! first_name: "William", last_name: "Hoos", email: "william.hoos@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki"

studies = Study.order('RANDOM()').first(500)
hash = Hash.new(0)
studies.each do |study|
  title_array = study.brief_title.split(' ')

  title_array.each do |word|
    # delete any characters that are not letters or hyphens or apostrophes.
    # if you want to make it not delete numbers, change it to "^a-zA-Z0-9-\'"
    sanitized = word.delete("^a-zA-Z-\'")
    # this regex disallows 1-letter words, which is unintended,
    # but 1-letter words are relatively useless for the autosuggest anyway
    # change this if necessary
    if sanitized =~ /^[a-zA-Z]+(?:['-]*[a-zA-Z]+)*$/
      unless sanitized =~ /'/ or sanitized =~ /.*[A-Z].*[A-Z].*/
        sanitized = sanitized.downcase
      end
      hash[sanitized] += 1
    end
  end
end
hash.each_pair do |word, word_count|
  WordFrequency.create! name: word, frequency: word_count
end

WordFrequency.order(frequency: :asc).last(10).each do |x|
  puts x.rank(x.name).to_s + ". " + x.name + ' ' + x.frequency.to_s
end


