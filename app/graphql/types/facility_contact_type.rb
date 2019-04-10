module Types
  class FacilityContactType < Types::BaseObject
    field :id, Int, null: false
    field :nct_id, String, null: false
    field :contact_type, String, null: false
    field :name, String, null: true
    field :email, String, null: true
    field :phone, String, null: true
  end
end
