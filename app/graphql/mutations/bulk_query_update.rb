module Mutations
  class BulkQueryUpdate < BaseMutation
    include BulkUpdateHelper
    field :undo_actions, [Types::StudyFacetState], null: true
    field :test, [String], null: true

    argument :search_params, Types::SearchInputType, required: true
    argument :agg_state, [Types::FacetStateInput], required: true

    def resolve(search_params:, agg_state:)
      current_user = context[:current_user]
      raise "Unauthorized" if current_user.blank? || !current_user.has_role?(:admin)

      search_service = SearchService.new(search_params.to_h)
      studies = search_service.search(includes: [:wiki_page])[:studies]
      bulk_params, studies_updated = build_bulk_params(studies, agg_state).values_at(:bulk_params, :studies_updated)
      undo_actions = build_undo_actions(studies_updated)

      bulk_create_or_update_wiki_page_for_study(bulk_params: bulk_params, user: context[:current_user])
      { undo_actions: undo_actions }
    end
  end
end
