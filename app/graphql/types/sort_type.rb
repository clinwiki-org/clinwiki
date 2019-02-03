module Types
  class SortType < BaseInputObject
    description "Column to sort by"
    argument :id, String, description: "Column to sort by", required: true
    argument :desc, Boolean, description: "Sort in descending order if true", required: false, default_value: false
  end
end
