module Types
  class WikiPageType < Types::BaseObject
    implements TimestampsType

    field :nctId, String, null: false
    field :meta, String, "Json key value pairs of meta information", null: false
    field :content, String, null: false
    field :edits, [WikiPageEditType], null: false
    field :meta2, [MetaType], null: false

    def meta
      object.meta.to_json
    end
    def meta2
      array =[]
      object.meta.each do |key, value|
        array.push({crowd_key: key,crowd_value:{crowd_value: value.split("|")}})
      end
      array
    end

    def edits
      Loaders::Association.for(WikiPage, :wiki_page_edits)
        .load(object)
        .then { |edits| edits.sort_by(&:created_at).reverse }
    end
  end
end
