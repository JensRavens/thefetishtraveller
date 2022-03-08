class AddGoogleIdToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :google_id, :string
    add_index :users, :google_id, unique: true
  end
end
