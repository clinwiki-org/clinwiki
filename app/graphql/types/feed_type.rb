module Types
  class FeedType < Types::BaseObject
    description "Feed is a saved search"
    field :id, Integer, "Id", null: false
    field :kind,
          FeedKindType,
          "Feeds can be designed for different purposes, that are distingiuhed by kind",
          null: false
    field :name, String, "Name", null: false
    field :owner_id, Integer, "Id of the owner", null: false, method: :user_id
    field :owner, UserType, "Owner of the feed", null: false, method: :user
    field :study_edge, StudyEdgeType, "Return study decorated with navigation cursors for current feed", null: true do
      argument :id, String, "When id is null returns first edge in the feed.", required: false
    end

    def study_edge(id: nil)
      object.study_edge(id)
    end
  end
end
