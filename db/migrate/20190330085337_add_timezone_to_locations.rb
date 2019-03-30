class AddTimezoneToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :timezone, :string
  end
end
