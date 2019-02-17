module Types
  class InterventionType < Types::BaseObject
    description "AACT Intervention entity"

    field :id, Integer, "Intervention id", null: false
    field :type, String, "Intervention type", null: true, method: :intervention_type
    field :name, String, "Intervention name", null: true
    field :description, String, "Intervention description", null: true
    field :wikipedia_url,
          String,
          "Link to wikipedia article derived from name. Use sparingly as it actually hits wikipedia api to get the url",
          null: true

    def wikipedia_url
      Wikipedia.url_for(search_text: object.name)
    end
  end
end
