module Types
  class SiteSelectType < Types::BaseObject
    field :kind, FilterKindType, null: false
    field :values, [String], null: false
  end
end
