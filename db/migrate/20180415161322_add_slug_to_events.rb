class AddSlugToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :slug, :string
    add_index :events, :slug
  end
end
