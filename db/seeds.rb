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
    # delete any characters that are not letters or hyphens or apostrophes or numbers.
    sanitized = word.delete("^a-zA-Z-'0-9")
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
hash.each_pair do |word, word_count|
  WordFrequency.create! name: word, frequency: word_count
end

WordFrequency.order(frequency: :asc).last(10).each do |x|
  puts x.rank(x.name).to_s + ". " + x.name + ' ' + x.frequency.to_s
end


