module Types
  class SitePresearchPageType < Types::BaseObject
    field :aggs, SiteAggSectionType, null: false
    field :crowd_aggs, SiteAggSectionType, null: false
    field :fields, [String], null: false
    field :button, PresearchButtonSectionType, null:false
    field :instructions, String, null: false
    field :show_results, Boolean, null: true

    def crowd_aggs
      object[:crowdAggs]
    end
    def show_results
      object[:showResults]
    end
  end
end
