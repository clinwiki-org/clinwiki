class SavedSearch < ApplicationRecord
  belongs_to :user
  belongs_to :short_link
  
  validates :name_label, presence: true
  validates :url, presence: true
end
