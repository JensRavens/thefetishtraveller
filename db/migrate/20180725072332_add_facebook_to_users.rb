# frozen_string_literal: true

class AddFacebookToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :facebook_id, :string
    add_index :users, :facebook_id
  end
end
