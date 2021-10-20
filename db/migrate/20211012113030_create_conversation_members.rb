# frozen_string_literal: true

class CreateConversationMembers < ActiveRecord::Migration[6.1]
  def change
    create_table :conversation_members, id: :uuid do |t|
      t.references :conversation, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:conversation_id, :user_id], unique: true
    end
  end
end
