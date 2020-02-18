module Types
  class SiteConfigFieldType < Types::BaseObject
    field :show_presearch, Boolean, null: false
    field :show_facet_bar, Boolean, null: false
    field :show_auto_suggest, Boolean, null: false
    field :show_bread_crumbs, Boolean, null: false
    field :show_results, Boolean, null: false



    def show_presearch
      object[:showPresearch]
    end

    def show_facet_bar
      object[:showFacetBar]
    end

    def show_auto_suggest
      object[:showAutoSuggest]
    end

    def show_bread_crumbs
      object[:showBreadCrumbs]
    end

    def show_results
      object[:showResults]
    end
  end
end
