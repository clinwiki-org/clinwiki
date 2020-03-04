module Types
  class SiteAutoSuggestSectionType < Types::BaseObject
    field :aggs, [String], null: false
    field :crowd_aggs, [String], null: false

    def crowd_aggs
      object[:crowdAggs]
    end
  end
end
