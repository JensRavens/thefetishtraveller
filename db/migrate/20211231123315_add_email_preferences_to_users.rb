# frozen_string_literal: true

class AddEmailPreferencesToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :email_preferences, :string
    add_index :users, :email_preferences
  end
end
