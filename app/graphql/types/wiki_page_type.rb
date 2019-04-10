module Types
  class WikiPageType < Types::BaseObject
    implements TimestampsType

    field :nctId, String, null: false
    field :meta, String, "Json key value pairs of meta information. This doesn't include tags, etc.", null: false
    field :content, String, null: false
    field :tags, [String], null: false
    field :edits, [WikiPageEditType], null: false

    def meta
      object.meta.to_json
    end

    def tags
      object.tags || []
    end

    def edits
      Loaders::Association.for(WikiPage, :wiki_page_edits)
        .load(object)
        .then { |edits| edits.sort_by(&:created_at).reverse }
    end
  end
end
