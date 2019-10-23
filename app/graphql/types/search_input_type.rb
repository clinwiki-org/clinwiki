module Types
  class SearchInputType < BaseInputObject
    description "Attributes for performing a search"
    argument :q, SearchQueryInputType, "an optional query -- defaults to current user default query", required: true
    argument :page, Int, "which page of search results we want. for now, use either page and pageSize or none of them",
             required: false, default_value: 1
    argument :pageSize, Int, "how many results we want. for now, use either page and pageSize or none of them",
             required: false, default_value: 25
    argument :sorts, [SortInputType], "which fields to sort by", required: false
    argument :aggOptionsFilter, String, "the values in aggs will be filtered by that paramater using a substring match",
             required: false
    argument :aggOptionsSort, String, "the values in aggs will be sorted according to this possible values are 'asc' or 'desc'", required: false
    argument :aggFilters, [AggFilterInputType], "the aggs we are filtering on", required: false
    argument :crowdAggFilters, [AggFilterInputType], "the crowd aggs we should filter on", required: false
    argument :agg, String, "an agg to query for, used when retrieving all buckets for an agg", required: false

    def to_h
      res = super.to_h.deep_dup.deep_symbolize_keys
      res[:sorts]&.each do |sort|
        sort[:id] = sort[:id].underscore
      end
      res
    end
  end
end
