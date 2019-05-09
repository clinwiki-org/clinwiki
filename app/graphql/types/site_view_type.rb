module Types
  class SiteViewType < Types::BaseObject
    field :id, Integer, null: false
    field :search, SiteSearchPageType, null: false

    def search
      object.view[:search]
    end
  end
end
