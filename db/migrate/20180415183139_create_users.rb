# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users, id: :uuid do |t|
      t.string :email
      t.string :first_name
      t.string :last_name
      t.string :password_digest

      t.timestamps
    end
    add_index :users, :email
  end
end
