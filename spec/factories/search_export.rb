# frozen_string_literal: true

FactoryBot.define do
  factory :search_export do
    short_link
    site_view
    user
  end
end
