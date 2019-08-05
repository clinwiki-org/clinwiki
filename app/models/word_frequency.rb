class WordFrequency < ApplicationRecord
  searchkick word_start: [:name], callbacks: :queue, batch_size: 25

  self.primary_key = "name"

  def total_frequency
    WordFrequency.sum(:frequency)
  end

  def percentage(word)
    WordFrequency.where(:name => word).frequency / total_frequency
  end
  #
  # def rank(word)
  #   WordFrequency.all.order(frequency: :desc).map(&:name).index(word) + 1
  # end
end
