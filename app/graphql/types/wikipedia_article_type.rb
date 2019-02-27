module Types
  class WikipediaArticleType < Types::BaseObject
    description "Article from https://www.wikipedia.org/"

    field :id, Integer, "Id of the article on Wikipedia", null: false
    field :title, String, "Artictle title", null: false
    field :description, String, "Brief description", null: false
    field :url, String, "Wikipedia url", null: false
  end
end
