module Types
  class OverallOfficialType < Types::BaseObject
    field :name, String, null: true
    field :affiliation, String, null: true
    field :role, String, null: true
  end
end
