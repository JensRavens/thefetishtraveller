class AddProfileInfoToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :location_description, :string
    add_column :users, :instagram, :string
    add_column :users, :recon, :string
    add_column :users, :romeo, :string
    add_column :users, :bluf, :string
  end
end
