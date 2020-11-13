class SearchLog < ApplicationRecord
  belongs_to :user
  belongs_to :short_link

  validates :name_default, presence: true
end
