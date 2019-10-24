module Mutations
  class BulkQueryUpdate < BaseMutation
    include BulkUpdateHelper
    field :undo_actions, [Types::StudyFacetState], null: true
    field :test, [String], null: true
    
    argument :search_params, Types::SearchInputType, required: true
    argument :agg_state, [Types::FacetStateInput], required: true


    def resolve(search_params:, agg_state:)
      current_user = context[:current_user]
      if !current_user.present? || !current_user.has_role?(:admin)
        raise "Unauthorized"
      end


      search_service = SearchService.new(search_params.to_h)
      studies = search_service.search[:studies]
      studies_updated = {}

      studies.each do |study|
        studies_updated[study[:nct_id]] = []
        agg_state.each do |state|
          params = { study_id: study[:nct_id] }
          if state[:enable]
            params[:add_meta] = {
              key: state[:name],
              value: state[:value],
            }
          else
            params[:delete_meta] = {
              key: state[:name],
            }
          end
          studies_updated[study[:nct_id]].push(state.to_h)
          create_or_update_wiki_page_for_study(params: params, user: context[:current_user])
        end
      end
      
      undo_actions = []
      studies_updated.each do |key, value| 
        undo_actions.push({
          "nct_id" => key,
          "state" => value.map { |s| 
            {
              "name" => s[:name],
              "value" => s[:value],
              "enable" => !s[:enable]
            }
          }
        })
      end
      { undo_actions: undo_actions }
    end

    # def authorized?(args)
    #   current_user = context[:current_user]
     
      
    # end
  end
end
