module Types
  class BaseObject < GraphQL::Schema::Object
    include GraphQL::Schema::Member::GraphQLTypeNames
    include AuthHelpers
  end
end
