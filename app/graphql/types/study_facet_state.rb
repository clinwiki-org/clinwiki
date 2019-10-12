module Types
  class StudyFacetState < BaseInputObject
    description "Set of facet states for a particular study"
    argument :nct_id, String, "id", required: true
    argument :state , [FacetState], "", required: true
  end
end