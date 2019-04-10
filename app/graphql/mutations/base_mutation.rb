module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    include AuthHelpers
  end
end
