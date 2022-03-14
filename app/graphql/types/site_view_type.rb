module Types
  class SiteViewType < Types::BaseObject
    field :id, Integer, null: false
    field :study, SiteStudyPageType, null: false
    field :search, SiteSearchPageType, null: false
    field :name, String, null:true
    field :default, Boolean, null:true
    field :url, String, null:true
    field :description, String, null:true

    def study
      object.view[:study]
    end

    def search
      object.view[:search]
    end

    def workflow
      object.view[:workflow]
    end
  end
end
