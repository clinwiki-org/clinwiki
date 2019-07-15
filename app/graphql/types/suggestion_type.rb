module Types
  class SuggestionType < Types::BaseObject
    description "A suggestion"
    #field :id, Integer, "Id", null: false

    field :word, String, "Word", null: false

    def word
    	object.keys.first
    end 

    field :frequency, Integer, "Word count of the word", null: false

    def frequency 
      	object.values.first # Return the only value in the hash 
    end 
  end


end
