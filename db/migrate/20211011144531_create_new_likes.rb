# frozen_string_literal: true

class CreateNewLikes < ActiveRecord::Migration[6.1]
  def change
    create_table :likes, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :post, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:user_id, :post_id], unique: true
    end
  end
end
