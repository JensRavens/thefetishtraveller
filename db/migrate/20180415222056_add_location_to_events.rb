# frozen_string_literal: true

class AddLocationToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :location_id, :uuid
    add_index :events, :location_id
    add_foreign_key :events, :locations
  end
end
