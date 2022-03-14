module Types
  class SearchParamsType < Types::BaseObject
    field :q, String, "A Json version of the SearchQueryInput type", null: true
    field :page, Integer, null: true
    field :pageSize, Integer, null: true
    field :sorts, [Types::SortType], null: true
    field :aggFilters, [Types::AggFilterType], null: true
    field :crowdAggFilters, [Types::AggFilterType], null: true

    def q
      object[:q].to_json
    end
  end
end
