module Types
  class SiteAggSectionType < Types::BaseObject
    field :selected, SiteSelectType, null: false
    field :fields, [SiteAggFieldType], null: false
  end
end
