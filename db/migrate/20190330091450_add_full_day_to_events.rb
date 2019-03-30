class AddFullDayToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :full_day, :boolean, default: false
    reversible do |dir|
      dir.up do
        Event.update_all("full_day = extract(hour from start_at) = 0")
      end
    end
    change_column_null :events, :full_day, false
  end
end
