module Types
  class SearchResultType < BaseObject
    field :field, String, "An arbitrary search result field", null: true do
      argument :name, String, "The field we're requesting", required: false
    end

    def field(name:)
      object.fetch(name.to_sym, nil)
    end
  end
end
