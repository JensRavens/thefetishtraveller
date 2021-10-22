# frozen_string_literal: true

class CreateYaelEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :yael_events do |t|
      t.string :name, null: false
      t.string :stream, null: false
      t.jsonb :payload, null: false
      t.datetime :created_at, null: false, default: "NOW()"
    end

    add_index :yael_events, :name
    add_index :yael_events, :stream
  end
end
