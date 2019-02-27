module Types
  class MutationType < BaseObject
    field :deleteFeed, mutation: Mutations::DeleteFeed
    field :createFeed, mutation: Mutations::CreateFeed
  end
end
