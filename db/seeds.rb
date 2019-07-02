# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
User.create! first_name: "Sheri", last_name: "Tibbs", email: "sheri.tibbs@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki"
User.create! first_name: "William", last_name: "Hoos", email: "william.hoos@gmail.com",
             password: "clinwiki", password_confirmation: "clinwiki"

WordFrequency.create! name: "cancer", frequency: 10, rank: 1
WordFrequency.create! name: "test", frequency: 5, rank: 2
WordFrequency.create! name: "kidney", frequency: 3, rank: 3
WordFrequency.create! name: "lung", frequency: 2, rank: 4
WordFrequency.create! name: "prostate", frequency: 1, rank: 5
