require_relative './search_result_type'
module Types
  class QueryType < BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World!"
    end

    field :search, Types::SearchResultSetType, null: false do
      argument :q, String, 'an optional query -- defaults to current user default query', required: false
      argument :page, Int, 'which page of search results we want', required: false, default_value: 1
      argument :pageSize, Int, 'how many results we want', required: false, default_value: 25
    end
    def search(args)
      p args
      SearchService.new(args, self.context).search_studies
    end
  end
end
