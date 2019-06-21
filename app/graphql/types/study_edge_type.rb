module Types
  class StudyEdgeType < BaseObject
    description "Study decorated with navigation cursors"

    field :prevId, String, "Id of a previous study", null: true
    field :nextId, String, "Id of a next study", null: true
    field :isWorkflow, Boolean, "Study is in a workflow mode", null: false
    field :study, StudyType, "Study", null: false
    field :recordsTotal, Integer, "Total number of records", null: false
    field :counterIndex, Integer, "The index of the study in the results", null: false
    field :firstId, String, "Id of the first study", null: true

    def recordsTotal
      object.view[:recordsTotal]
    end

    def counterIndex
      object.view[:counterIndex]
    end
  end
end
