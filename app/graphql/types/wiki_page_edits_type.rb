# frozen_string_literal: true

module Types
  class WikiPageEditsType < BaseObject
    field :body_changed, Boolean, null: false
    field :front_matter_changed, Boolean, null: false
    field :edit_lines, [WikiPageEditLineType], null: false
  end
end
