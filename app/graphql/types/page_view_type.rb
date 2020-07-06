module Types
  class PageViewType < Types::BaseObject
    field :id, Integer, null: false
    field :title , String, null:false
    field :template, String, null:false
    field :url, String, null:false
    field :page_type, String, null:false
  end
end
