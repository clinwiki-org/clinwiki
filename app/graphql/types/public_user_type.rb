module Types
  class PublicUserType < BaseObject
    field :id, Int, "Id", null: false
    field :first_name, String, "First name", null: true
    field :last_name, String, "Last name", null: true
  end
end
