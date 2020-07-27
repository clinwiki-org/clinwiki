module Types
  class CentralContactType < Types::BaseObject
    field :name, String, null: true
    field :contact_type, String, null: true
    field :phone, String, null: true
    field :email, String, null: true
  end
end
