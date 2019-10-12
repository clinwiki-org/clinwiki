module Mutations
  class BulkQueryUpdate < BaseMutation
    argument :search_params, Types::SearchInputType, required: true
    argument :agg_state, [Types::FacetState], required: true

    # field :undo_actions, [Types::StudyFacetState], null: true

    def resolve(search_params:, agg_state:)
        # TODO - 
        # 1 - Apply the changes to the set of studies defined by search_params
        # 2 - Return a list of { nct_id, [FacetState] } where FacetState is omitted
        #     if no change was applied.
        #     This will allow the client to send an "undo" instruction
        { undo_actions: [] }
    end
  end
end