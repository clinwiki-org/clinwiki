module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    include AuthHelpers
    include ActiveRecordHelpers
  end
end
