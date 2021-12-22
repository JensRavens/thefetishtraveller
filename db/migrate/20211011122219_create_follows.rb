# frozen_string_literal: true

class CreateFollows < ActiveRecord::Migration[6.1]
  def change
    create_table :follows, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :profile, null: false, foreign_key: {to_table: :users}, type: :uuid

      t.timestamps
      t.index [:user_id, :profile_id], unique: true
    end
  end
end
