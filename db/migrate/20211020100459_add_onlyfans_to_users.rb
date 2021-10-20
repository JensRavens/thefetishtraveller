# frozen_string_literal: true

class AddOnlyfansToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :onlyfans, :string
  end
end
