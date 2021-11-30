class AddLayoutOptionsToArticles < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :layout_options, :jsonb, null: false, default: {}
  end
end
