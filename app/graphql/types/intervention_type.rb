module Types
  class InterventionType < Types::BaseObject
    description "AACT Intervention entity"

    field :id, Integer, "Intervention id", null: false
    field :type, String, "Intervention type", null: true, method: :intervention_type
    field :name, String, "Intervention name", null: true
    field :description, String, "Intervention description", null: true
    field :wikipedia_article,
          WikipediaArticleType,
          "Wikipedia article searched by name. Use sparingly as it actually hits wikipedia api to get the data.",
          null: true

    def wikipedia_article
      Wikipedia.find_article(search_text: object.name)
    end
  end
end
