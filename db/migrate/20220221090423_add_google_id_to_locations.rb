class AddGoogleIdToLocations < ActiveRecord::Migration[6.1]
  def change
    add_column :locations, :google_id, :string
    add_index :locations, :google_id
  end
end
