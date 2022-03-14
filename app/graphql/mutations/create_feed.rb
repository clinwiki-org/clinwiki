module Mutations
  class CreateFeed < BaseMutation
    argument :search_params, Types::SearchInputType, required: true
    argument :name, String, required: true
    argument :kind, Types::FeedKindType, required: true

    field :feed, Types::FeedType, null: true
    field :errors, [String], null: false

    def resolve(search_params:, kind:, name:)
      user = context[:current_user]
      return { feed: nil, errors: ["Unauthorized"] } if user.blank?

      feed = user.feeds.build(
        search_params: search_params.to_h.except(:page, :page_size),
        kind: kind,
        name: name,
      )
      if feed.save
        { feed: feed, errors: [] }
      else
        { feed: nil, errors: feed.errors.full_messages }
      end
    end
  end
end
