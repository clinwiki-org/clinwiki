# frozen_string_literal: true

FactoryBot.define do

  factory :short_link do

    short { Faker::Crypto.md5 }
    long { {
      "agg_filters"=>[],
      "crowd_agg_filters"=>[],
      "page"=>0,
      "page_size"=>25,
      "q"=>{"children"=>[], "key"=>"AND"},
      "sorts"=>[]
    }.to_json }

  end

end
