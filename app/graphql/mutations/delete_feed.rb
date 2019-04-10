module Mutations
  class DeleteFeed < BaseMutation
    field :feed, Types::FeedType, null: true

    argument :id, Integer, "Id of the feed to delete", required: true

    def resolve(id:)
      current_user = context[:current_user]
      return nil unless current_user

      feed = current_user.feeds.find_by(id: id)
      return nil unless feed

      feed.destroy!
      { feed: feed }
    end
  end
end
