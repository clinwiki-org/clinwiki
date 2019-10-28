module Mutations
  class BulkListUpdate < BaseMutation
    include BulkUpdateHelper
    argument :updates, [Types::StudyFacetStateInput], required: true

    def resolve(updates:)
      current_user = context[:current_user]
      raise "Unauthorized" if current_user.blank? || !current_user.has_role?(:admin)

      bulk_params = []
      studies = Study.where(nct_id: updates.map(&:nct_id)).includes(:wiki_page)
      updates.each_with_index do |update, idx|
        params = {
          study: studies[idx],
          add_meta: {},
          delete_meta: {},
        }
        update[:state].each do |state|
          if state[:enable]
            values = params[:add_meta][state[:name]] || []
            values << state[:value]
            params[:add_meta][state[:name]] = values
          else
            values = params[:delete_meta][state[:name]] || []
            values << state[:value]
            params[:delete_meta][state[:name]] = values
          end
        end
        bulk_params.push(params)
      end
      bulk_create_or_update_wiki_page_for_study(bulk_params: bulk_params, user: context[:current_user])
      nil
    end
  end
end
