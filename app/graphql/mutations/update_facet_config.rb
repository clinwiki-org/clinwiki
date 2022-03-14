module Mutations
    class UpdateFacetConfig < BaseMutation
      field :main_config, String, null: false
      field :errors, [String], null: true
  
      argument :json_obj, String, required: true
  
      def resolve(json_obj:)
        facet_config = FacetConfig.first
        facet_config.main_config = json_obj
        if facet_config.save
          { main_config: json_obj, errors: nil }
        else
          { main_config: json_obj, errors: saved_search.errors.full_messages }
        end
      end
  
    end
  end