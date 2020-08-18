class StudyViewLog < ApplicationRecord

  include BelongsToStudy
  belongs_to :user
end
