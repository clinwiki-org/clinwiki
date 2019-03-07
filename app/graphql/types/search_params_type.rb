module Types
  class SearchParamsType < Types::BaseObject
    field :q, String, null: true
    field :page, Integer, null: true
    field :pageSize, Integer, null: true
    field :sorts, [Types::SortType], null: true
    field :aggFilters, [Types::AggFilterType], null: true
    field :crowdAggFilters, [Types::AggFilterType], null: true
  end
end
