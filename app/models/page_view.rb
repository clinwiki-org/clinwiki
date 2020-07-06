class PageView < ApplicationRecord
  belongs_to :site
  validates :site, presence: true
  enum page_type: [ :study ]
end
