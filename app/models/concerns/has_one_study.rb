module HasOneStudy
  extend ActiveSupport::Concern

  included do
    belongs_to :study, foreign_key: "nct_id", inverse_of: name.underscore.to_sym
  end
end
