class Reference < AactRecord
  include BelongsToStudy

  self.table_name = "study_references"

  def type
    reference_type
  end
end
