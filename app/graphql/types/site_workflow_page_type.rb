module Types
  class SiteWorkflowPageType < Types::BaseObject
    field :add_rating, Boolean, null: false

    def add_rating
      object[:addRating] == "true"
    end
  end
end
