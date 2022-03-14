module Types
  class SearchQueryInputType < Types::BaseInputObject
    description <<-DESC
    An input type for a search query param (q).
    This is a tree like structure where leafs are the search terms and
    tree nodes are the AND / OR conditions.
    DESC
    argument :key,
             String,
             description: "For non-leaf elements this is `AND` or `OR`. For leafs - it's the search term",
             required: true
    argument :children, [SearchQueryInputType], description: "Children element",
             required: false, default_value: []
  end
end
