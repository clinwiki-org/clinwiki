class StudyView < ApplicationRecord
  belongs_to :site
  validates :site, presence: true

end
