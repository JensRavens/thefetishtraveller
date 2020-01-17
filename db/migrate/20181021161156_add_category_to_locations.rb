# frozen_string_literal: true

class AddCategoryToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :category, :string
    add_index :locations, :category
  end
end
