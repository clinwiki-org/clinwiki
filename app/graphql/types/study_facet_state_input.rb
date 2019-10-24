module Types
  class StudyFacetStateInput < BaseInputObject
    argument :nct_id, String, required: true
    argument :state, [FacetStateInput], required: true
  end
end