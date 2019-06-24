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
    field :hashFirst, String, "The search hash of the first page", null: true
    field :hashNext, String, "The search hash of the next page", null: true
    field :hashPrev, String, "The search hash of the previous page", null: true
    field :pageSize, Integer, "The page size given search hash", null: false
  end
end
