module Types
  class SearchResultSetType < BaseObject
    field :recordsTotal, Int, description: "Total results", null: true, hash_key: :recordsTotal
    field :aggs, [AggType], null: true
    field :autocomplete, [AutocompleteType], null: true, description: "autocomplete result"
    field :study_edge, StudyEdgeType, "Return study decorated with navigation cursors for current search", null: true do
      argument :id, String, "When id is null returns first edge in the search results.", required: false
    end

    field :studies, [ElasticStudyType], "A set of matching studies", null: false

    def study_edge(id:)
      search_params = context[:search_params]
      study_edge_service = StudyEdgeService.new(search_params)
      study_edge_service.study_edge(id)
    end

    def aggs
      object.fetch(:aggs, []).map do |key, val|
        Hashie::Mash.new(
          name: key,
          buckets: val.fetch("buckets", []),
          doc_count_error_upper_bound: val.fetch("doc_count_error_upper_bound", 0),
          sum_other_doc_count: val.fetch("sum_other_doc_count", 0),
        )
      end
    end

    # def autocomplete
      # x = object.fetch(:autocomplete, [])
      # return x
    # end
  end
end
