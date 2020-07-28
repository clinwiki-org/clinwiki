module Types
    class DesignType < Types::BaseObject
     
      field :id, Integer, "Design id", null: false
      field :allocation, String, "Design ", null: true
      field :interventional_model, String, "Interventional model", null: true
      field :observational_model, String, "Observational model", null: true
      field :primary_purpose, String, "Design purpose", null: true
      field :time_perspective, String, "Time", null: true
      field :masking, String, "Design masking", null: true
      field :masking_description, String, "Description of masking", null: true
      field :interventional_model_description, String, "Intervention model description", null: true
      field :subject_masked, Boolean, "subject masked?", null: true
      field :caregiver_masked, Boolean, "Caregiver masked?", null: true
      field :investigator_masked, Boolean, "Investigator masked?", null: true
      field :outcomes_assessor_masked, Boolean, "Assessor masked?", null: true
      
    end
  end