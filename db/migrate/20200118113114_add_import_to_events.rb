# frozen_string_literal: true

class AddImportToEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :events, :bluf_id, :string
    add_index :events, :bluf_id, unique: true
    add_column :locations, :bluf_id, :string
    add_index :locations, :bluf_id, unique: true
  end
end
