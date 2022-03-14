module Types
  class SiteViewMutationInputType < Types::BaseInputObject
    description "An atomic mutation of site"
    argument :path,
             [String],
             "Path to updated element in json. For arrays use `name` attribute element for path value",
             required: true
    argument :operation, Types::SiteViewOperationType, required: true
    argument :payload, String, "Json for this operation", required: true
  end
end
