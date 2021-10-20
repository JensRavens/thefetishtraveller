# frozen_string_literal: true

class AddOnboardingToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :visibility, :string
    add_index :users, :visibility
    remove_column :users, :public_profile, :boolean
  end
end
