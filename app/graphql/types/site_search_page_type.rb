module Types
  class SiteSearchPageType < Types::BaseObject
    field :aggs, SiteAggSectionType, null: false
    field :crowd_aggs, SiteAggSectionType, null: false
    field :fields, [String], null: false
    field :config, SiteConfigSectionType, null:false
    field :presearch ,SitePresearchPageType,null:false
    field :auto_suggest,SiteAutoSuggestSectionType ,null:false
    field :bread_crumbs,[SiteBreadCrumbsSectionType] ,null:false
    field :results, SiteResultsSectionType, null:false

    def crowd_aggs
      object[:crowdAggs]
    end

    def auto_suggest
      object[:autoSuggest]
    end

    def bread_crumbs
      object[:breadCrumbs]
    end
  end
end
