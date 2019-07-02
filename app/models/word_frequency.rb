class WordFrequency < ApplicationRecord
  self.primary_key = "name"

  def totalFrequency
    WordFrequency.sum(:frequency)
  end

  def percentage(word)
    WordFrequency.where(:name => word).frequency / totalFrequency
  end
end
