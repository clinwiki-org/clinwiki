# frozen_string_literal: true

module Types
  class DiffType < Types::BaseEnum
    value "INS", "Inserted line"
    value "DEL", "Deleted line"
    value "UNCHANGED", "Unchanged line"
    value "DIFFCOMMENT", "A comment line"
  end
end
