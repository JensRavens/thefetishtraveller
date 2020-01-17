# frozen_string_literal: true

class CreateJoinTableLocationsUsers < ActiveRecord::Migration[5.2]
  def change
    create_join_table :locations, :users, column_options: { type: :uuid }
  end
end
