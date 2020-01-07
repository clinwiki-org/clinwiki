module Types
  class AutocompleteType < BaseObject
    field :name, String, null: false
    field :results, [AggBucketType], null: false
  end
end
