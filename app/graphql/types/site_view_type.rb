module Types
  class SiteViewType < Types::BaseObject
    field :id, Integer, null: false
    field :study, SiteStudyPageType, null: false
    field :search, SiteSearchPageType, null: false
    field :workflow, SiteWorkflowPageType, null: false

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
