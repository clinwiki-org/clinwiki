module Types
  class PageViewType < Types::BaseObject
    field :id, Integer, null: false
    field :title , String, null:false
    field :template, String, null:false
  end
end
