class MoveTravelPlans < ActiveRecord::Migration[6.1]
  def change
    rename_table :likes, :travel_plans
  end
end
