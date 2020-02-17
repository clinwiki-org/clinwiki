module Types
  class SiteBreadCrumbsSectionType < Types::BaseObject
    field :icon, String, null: false
    field :target, String, null: false
    field :location, String, null: false
  end
end
