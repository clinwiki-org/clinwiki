class DesignOutcome < AactRecord
  include BelongsToStudy

  def display_outcome
    str = ""
    str += "#{measure} " if measure
    str += "(#{time_frame}) " if time_frame
    str += description if description
    str.strip
  end

  def type
    outcome_type
  end
end
