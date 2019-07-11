module Types
  class FreqwordType < BaseObject
    field :name, String, "Most Frequent words", null: true
    field :frequency, Int, 'Rank', null:true
  end
end
