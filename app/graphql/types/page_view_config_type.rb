module Types
  class PageViewConfigType < Types::BaseObject
    #Empty string as temporarily to be able to call type
    field :blank,String, null:false


    def blank
      ""
    end
  end
end
