# frozen_string_literal: true

class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    enable_extension "pgcrypto"
    create_table :events, id: :uuid do |t|
      t.jsonb :properties, default: "{}", null: false
      t.datetime :publish_at
      t.datetime :publish_until

      t.timestamps
    end
  end
end
