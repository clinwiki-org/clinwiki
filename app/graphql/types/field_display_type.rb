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
    value "BAR_CHART"
    value "DROP_DOWN"
    value "LESS_THAN_DROP_DOWN"
    value "GREATER_THAN_DROP_DOWN"
    value "LOCATION"
    value "MULTISELECT"
    value "CHECKBOX"
    value "CRUMBS_ONLY"
  end
end
