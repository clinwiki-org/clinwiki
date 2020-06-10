require 'rails_helper'

RSpec.describe Reaction, type: :model do

  describe "reaction requires nct_id, user_id, and reaction_kind" do
    let(:reaction) { Reaction.new() }
    it "creation of reaction requires multiple attributes to be defined" do
      expect(reaction.save).to be false
      expect(reaction.errors.messages).to have_key(:user_id)
      expect(reaction.errors.messages).to have_key(:nct_id)
      expect(reaction.errors.messages).to have_key(:reaction_kind_id)
    end

  end
  describe "reaction with nct_id, user_id, and reaction_kind" do
    let(:reaction) { Reaction.new(nct_id:"123",user_id:1, reaction_kind_id: 1) }
    it "creation of reaction requires multiple attributes to be defined" do
      expect(reaction.save).to be false
      expect(reaction.errors.messages).to have_key(:user)
    end

  end
end
