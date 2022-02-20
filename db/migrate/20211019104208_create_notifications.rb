# frozen_string_literal: true

class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :sender, null: false, foreign_key: {to_table: :users}, type: :uuid
      t.datetime :read_at
      t.string :notification_type
      t.references :subject, type: :uuid, polymorphic: true

      t.timestamps
    end
  end
end
