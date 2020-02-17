module Types
  class SitePresearchPageType < Types::BaseObject
    field :aggs, SiteAggSectionType, null: false
    field :crowd_aggs, SiteAggSectionType, null: false
    field :fields, [String], null: false
    field :button, PresearchButtonSectionType, null:false

    def crowd_aggs
      object[:crowdAggs]
    end
  end
end
