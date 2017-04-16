class DesignOutcome < Aact

  def display_outcome
    str=""
    str=str+"#{measure} " if measure
    str=str+"(#{time_frame}) " if time_frame
    str=str+"#{description}" if description
    str.strip
  end

  def type
    outcome_type
  end

end
