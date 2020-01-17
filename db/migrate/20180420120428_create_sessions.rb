# frozen_string_literal: true

class CreateSessions < ActiveRecord::Migration[5.2]
  def change
    create_table :sessions, id: :uuid do |t|
      t.uuid :user_id
      t.text :user_agent

      t.timestamps
    end

    add_index :sessions, :user_id
    add_foreign_key :sessions, :users
  end
end
