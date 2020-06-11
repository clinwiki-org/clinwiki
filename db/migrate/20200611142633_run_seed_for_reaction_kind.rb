class RunSeedForReactionKind < ActiveRecord::Migration[5.2]
  #Migration runs rake db:seed essentially
  def change
    Rails.application.load_seed
  end
end
