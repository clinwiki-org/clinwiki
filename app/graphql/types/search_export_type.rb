# frozen_string_literal: true

module Types
  class SearchExportType < Types::BaseObject
    # it makes me sad that we're not using relay-style ids everywhere
    field :id, Integer, null: false
    field :short_link, ShortLinkType, null: false
    field :filename, String, null: false
    field :download_url, String, null: true
    field :user, UserType, null: false
  end
end
