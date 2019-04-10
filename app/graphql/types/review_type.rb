module Types
  class ReviewType < Types::BaseObject
    implements TimestampsType

    field :id, Int, null: false
    field :meta, String, "Json key value pairs of meta information.", null: false
    field :content, String, null: false
    field :user, UserType, null: false

    def meta
      object.meta.to_json
    end

    def user
      Loaders::Association.for(Review, :user).load(object)
    end
  end
end
