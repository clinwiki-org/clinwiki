# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
puts "creating users"
starting_value = User.all.count
u = User.find_by_email("sheri.tibbs@gmail.com") || User.create!( first_name: "Sheri", last_name: "Tibbs", email: "sheri.tibbs@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki")
u2 = User.find_by_email("william.hoos@gmail.com") || User.create!( first_name: "William", last_name: "Hoos", email: "william.hoos@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki")
print "done"
added_value = User.all.count - starting_value
puts "started with #{starting_value} Users, created #{added_value} additional Users"


puts "creating ReactionKinds"
starting_value = ReactionKind.all.count
r = ReactionKind.find_or_initialize_by(name:"like").update(name:"like", unicode: "1F44D".hex.chr("utf-8"))
r2 = ReactionKind.find_or_initialize_by(name:"dislike").update(name:"dislike",unicode:"1F44E".hex.chr("utf-8"))
r3 = ReactionKind.find_or_initialize_by(name:"heart").update(name:"heart",unicode:"2764".hex.chr("utf-8"))
r4 = ReactionKind.find_or_initialize_by(name:"skull_and_cross_bones").update(name:"skull_and_cross_bones", unicode:"2620".hex.chr("utf-8"))
added_value = ReactionKind.all.count - starting_value
puts "started with #{starting_value} ReactionKinds, created #{added_value} additional ReactionKinds"


puts "creating Island Config"
config = "{\"aggSublabel\":null,\"autoSuggest\":false,\"bucketKeyValuePairs\":null,\"defaultToOpen\":null,\"display\":\"STRING\",\"displayName\":\"Status\",\"layout\":\"horizontal\",\"maxCrumbs\":null,\"name\":\"overall_status\",\"order\":{\"sortKind\":\"key\",\"desc\":true},\"preselected\":{\"kind\":\"WHITELIST\",\"values\":[]},\"rangeEndLabel\":null,\"rangeStartLabel\":null,\"rank\":null,\"showAllowMissing\":null,\"showFilterToolbar\":null,\"visibleOptions\":{\"kind\":\"WHITELIST\",\"values\":[]},\"aggKind\":\"aggs\"}"
type = "facet"
f = IslandConfig.create!(config: config, island_type: type)
puts f.present? ? "Island created" : "Could not create Island"