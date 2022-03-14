class StudyViewLog < ApplicationRecord
  include TriggersStudyReindex
  include BelongsToStudy
  belongs_to :user
end
