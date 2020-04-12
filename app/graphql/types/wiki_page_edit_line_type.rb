# frozen_string_literal: true

module Types
  class WikiPageEditLineType < Types::BaseObject
    field :status, DiffType, null: false, description: "The type of diff line."
    field :content, String, null: false, description: "The content of the line."
    field :front_matter, Boolean, null: false, description: "Whether the line is in the front matter."
    field :body, Boolean, null: false, description: "Whether the line is in the body."
  end
end
