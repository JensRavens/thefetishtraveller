# frozen_string_literal: true

class CreateLikes < ActiveRecord::Migration[5.2]
  def change
    create_table :likes, id: :uuid do |t|
      t.uuid :event_id, null: false
      t.uuid :user_id, null: false

      t.timestamps
    end
    add_foreign_key :likes, :users
    add_foreign_key :likes, :events
    add_index :likes, :event_id
    add_index :likes, :user_id
  end
end
