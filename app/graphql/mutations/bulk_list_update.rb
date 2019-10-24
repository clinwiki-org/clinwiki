module Mutations
  class BulkListUpdate < BaseMutation
    include BulkUpdateHelper
    argument :updates, [Types::StudyFacetStateInput], required: true

    def resolve(updates:)
      current_user = context[:current_user]
      if !current_user.present? || !current_user.has_role?(:admin)
        raise "Unauthorized"
      end
    
      updates.each do |update|
        pp update[:nct_id]
        update[:state].each do |state|
          params = { study_id: update[:nct_id] }
          
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
          create_or_update_wiki_page_for_study(params: params, user: context[:current_user])
        end
      end
      nil
    end
  end
end
