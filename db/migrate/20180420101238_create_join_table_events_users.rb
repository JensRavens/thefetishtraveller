# frozen_string_literal: true

class CreateJoinTableEventsUsers < ActiveRecord::Migration[5.2]
  def change
    create_join_table :events, :users, column_options: { type: :uuid }
  end
end
