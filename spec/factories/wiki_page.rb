# frozen_string_literal: true

FactoryBot.define do
  factory :wiki_page do
    study

    transient do
      updater { nil }
    end

    before(:create) do |page|
      page.updater ||= FactoryBot.create(:user)
    end
  end
end
