class CreateLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :locations, id: :uuid do |t|
      t.jsonb :properties, default: '{}', null: false
      t.string :slug
      t.timestamps
    end
    add_index :locations, :slug
  end
end
