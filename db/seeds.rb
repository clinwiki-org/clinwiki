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


puts "creating FacetConfig"
json = {"default"=>{"0"=>{"agg_sublabel"=> nil,"auto_suggest"=> false,"bucket_key_value_pairs"=> nil,"default_to_open"=> nil,"display"=> "STRING","display_name"=> "default","layout"=> "horizontal","max_crumbs"=> nil,"name"=> "default","order"=> {sortKind: "key", desc: true},"preselected"=> {"kind"=> "WHITELIST", "values"=> [] },"range_end_label"=> nil,"range_start_label"=> nil,"rank"=> nil,"show_allow_missing"=> nil,"show_filter_toolbar"=> nil,"visible_options"=> {"kind"=> "WHITELIST", "values"=> []},"agg_kind"=> "aggs"}}}.to_json
hash = {main_config: json}
f = FacetConfig.create!(main_config: json)
puts f.present? ? "FacetConfig created" : "Could not create FacetConfig"