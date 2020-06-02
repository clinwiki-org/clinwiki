# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
User.find_by_email("sheri.tibbs@gmail.com") || User.create!( first_name: "Sheri", last_name: "Tibbs", email: "sheri.tibbs@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki")
User.find_by_email("william.hoos@gmail.com") || User.create!( first_name: "William", last_name: "Hoos", email: "william.hoos@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki")
ReactionKind.find_or_initialize_by(name:"like").update(name:"like")
ReactionKind.find_or_initialize_by(name:"dislike").update(name:"dislike")
