module Types
  class SiteResultsSectionType < Types::BaseObject
    field :type, String, null:false
    field :buttons, ResultsButtonType, null: false
  end
end
