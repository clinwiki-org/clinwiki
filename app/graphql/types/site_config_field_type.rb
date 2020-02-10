module Types
  class SiteConfigFieldType < Types::BaseObject
    field :showPresearch, Boolean, null: false
    field :showFacetBar, Boolean, null: false
    field :showAutoSuggest, Boolean, null: false
    field :showBreadCrumbs, Boolean, null: false
    field :showResults, Boolean, null: false
  end
end
