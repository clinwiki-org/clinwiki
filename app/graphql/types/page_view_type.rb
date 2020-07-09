module Types
  class PageViewType < Types::BaseObject
    field :id, Integer, null: false
    field :title , String, null:false
    field :template, String, null:false
    field :url, String, null:false
    field :page_type, String, null:false
    # Change the name of this most likely
    field :updates, PageViewConfigType, null:true
  end
end
