module Types
  class BaseObject < GraphQL::Schema::Object
    include GraphQL::Schema::Member::GraphQLTypeNames
    include AuthHelpers
    include ActiveRecordHelpers
  end
end
