class Sponsor < AactRecord
  include BelongsToStudy

  scope :named, ->(agency) { where("name LIKE ?", "#{agency}%") }
end
