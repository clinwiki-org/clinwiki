module Mutations
  class UpdateWorkflowsView < BaseMutation
    field :workflows_view, Types::WorkflowsViewType, null: true
    field :errors, [String], null: true

    argument :mutations, [Types::SiteViewMutationInputType], required: true

    def resolve(args)
      view = WorkflowsView.instance
      mutations = args[:mutations].clone.map do |mutation|
        begin
          mutation[:payload] = JSON.parse(mutation[:payload])
        rescue StandardError # rubocop:disable Lint/HandleExceptions
          # use payload as string if it's not a json
        end
        mutation.to_h
      end
      view.updates = SiteViewUpdaterService.compact(view.mutations + mutations)
      if view.save
        { workflows_view: view.view, errors: nil }
      else
        { workflows_view: nil, errors: view.errors.full_messages }
      end
    end

    def authorized?(_args)
      current_user.present? && current_user.has_role?(:admin)
    end
  end
end
