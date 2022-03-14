module BelongsToStudy
  extend ActiveSupport::Concern

  included do
    belongs_to :study, foreign_key: "nct_id", inverse_of: name.pluralize(2).underscore.to_sym
  end
end
