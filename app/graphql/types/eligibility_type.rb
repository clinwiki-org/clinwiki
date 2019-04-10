module Types
  class EligibilityType < Types::BaseObject
    field :criteria, String, null: false
    field :gender, String, null: false
    field :healthy_volunteers, String, null: false
  end
end
