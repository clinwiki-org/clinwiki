module Types
  class AutocompleteType < BaseObject
    field :name, String, null: false
    field :results, [AggBucketType], null: false
    field :is_crowd, Boolean, null: false
  end
end
