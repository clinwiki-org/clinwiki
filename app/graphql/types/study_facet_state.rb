module Types
  class StudyFacetState < Types::BaseObject
    description "Set of facet states for a particular study"
    
    field :nct_id, String, null: true
    field :state , [FacetState], null: true
  end
end