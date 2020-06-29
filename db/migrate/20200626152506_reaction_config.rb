class ReactionConfig < ActiveRecord::Migration[5.2]
  def change
    add_column :sites, :reactions_config, :text, default: ReactionKind.all.select(:name).as_json(except: :id).to_json
  end
end
