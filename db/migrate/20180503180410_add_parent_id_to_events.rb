# frozen_string_literal: true

class AddParentIdToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :event_id, :uuid
    add_index :events, :event_id
    add_foreign_key :events, :events
  end
end
