module Types
  class SiteViewType < Types::BaseObject
    field :id, Integer, null: false
    field :search, SiteSearchPageType, null: false
    field :workflow, SiteWorkflowPageType, null: false

    def search
      object.view[:search]
    end

    def workflow
      object.view[:workflow]
    end

  end
end
