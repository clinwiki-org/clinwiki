module Types
  class MutationType < BaseObject
    field :upsertWikiLabel, mutation: Mutations::UpsertWikiLabel
    field :deleteWikiLabel, mutation: Mutations::DeleteWikiLabel
    field :upsertWikiTag, mutation: Mutations::UpsertWikiTag
    field :deleteWikiTag, mutation: Mutations::DeleteWikiTag
    field :updateWikiContent, mutation: Mutations::UpdateWikiContent
    field :upsertReview, mutation: Mutations::UpsertReview
    field :deleteReview, mutation: Mutations::DeleteReview
    field :deleteFeed, mutation: Mutations::DeleteFeed
    field :createFeed, mutation: Mutations::CreateFeed
  end
end
