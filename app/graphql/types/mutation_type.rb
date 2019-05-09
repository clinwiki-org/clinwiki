module Types
  class MutationType < BaseObject
    field :updateSiteView, mutation: Mutations::UpdateSiteView
    field :updateSite, mutation: Mutations::UpdateSite
    field :createSite, mutation: Mutations::CreateSite
    field :deleteSite, mutation: Mutations::DeleteSite
    field :updateProfile, mutation: Mutations::UpdateProfile
    field :signIn, mutation: Mutations::SignIn
    field :signUp, mutation: Mutations::SignUp
    field :resetPassword, mutation: Mutations::ResetPassword
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
