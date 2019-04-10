module Types
  class WikiPageEditType < Types::BaseObject
    implements TimestampsType

    field :id, Integer, null: false
    field :wiki_page, WikiPageType, null: false
    field :user, UserType, null: true
    field :diff, String, null: true
    field :diff_html, String, null: true
    field :comment, String, null: true

    def user
      Loaders::Association.for(WikiPageEdit, :user).load(object)
    end
  end
end
