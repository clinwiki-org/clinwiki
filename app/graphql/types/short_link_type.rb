module Types
  class ShortLinkType < Types::BaseObject
    field :short, String, null: true
    field :long, String, null: true
  end
end
