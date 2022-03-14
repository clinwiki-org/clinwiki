module Types
  class SiteSearchPageType < Types::BaseObject
    field :type, String, null:false
    field :aggs, SiteAggSectionType, null: false
    field :crowd_aggs, SiteAggSectionType, null: false
    field :fields, [String], null: false
    field :sortables, [String], null: false
    field :config, SiteConfigSectionType, null:false
    field :presearch ,SitePresearchPageType,null:false
    field :auto_suggest,SiteAutoSuggestSectionType ,null:false
    field :results, SiteResultsSectionType, null:false
    field :crumbs, CrumbResultSectionType, null:false
    field :template, String, null: false

    def crowd_aggs
      object[:crowdAggs]
    end

    def auto_suggest
      object[:autoSuggest]
    end

    def crumbs
      object[:crumbs]
    end
  end
end
