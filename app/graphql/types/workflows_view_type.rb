module Types
  class WorkflowsViewType < Types::BaseObject
    field :id, Int, null: false
    field :workflows, [WorkflowConfigType], null: false
  end
end
