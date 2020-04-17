module Types
  class SiteOrderType < Types::BaseObject
    field :sortKind, String, null:false
    field :desc, Boolean, null:false
  end
end
