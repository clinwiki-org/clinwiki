module Types
  class FieldDisplayType < Types::BaseEnum
    value "STRING"
    value "STAR"
    value "DATE"
    value "DATE_RANGE"
    value "NUMBER_RANGE"
    value "LESS_THAN_RANGE"
    value "GREATER_THAN_RANGE"
    value "PIE_CHART"
  end
end
