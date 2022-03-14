module Types
  class SiteOrderType < Types::BaseObject
    field :sort_kind, SortKindType, null: false
    field :desc, Boolean, null:false


    def sort_kind
      object[:sortKind]
    end
  end
end
