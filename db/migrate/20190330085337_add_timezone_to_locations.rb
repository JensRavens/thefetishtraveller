# frozen_string_literal: true

class AddTimezoneToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :timezone, :string
  end
end
