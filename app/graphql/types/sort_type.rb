module Types
  class SortType < BaseObject
    description "Column to sort by"
    field :id, String, description: "Column to sort by", null: false
    field :desc, Boolean, description: "Sort in descending order if true", null: true
  end
end
