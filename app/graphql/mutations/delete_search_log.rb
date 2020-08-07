module Mutations
  class DeleteSearchLog < BaseMutation
    field :search_log, Types::SearchLogType, null: true

    argument :id, Integer, "Id of the search log  to delete", required: true

    def resolve(id:)
      current_user = context[:current_user]
      return nil unless current_user

      search_log = current_user.search_logs.find_by_id(id)
      return nil unless search_log
      search_log.update(user_id: nil)

      
      { search_log: search_log}
    end
  end
end
