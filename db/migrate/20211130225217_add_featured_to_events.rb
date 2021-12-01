# frozen_string_literal: true

class AddFeaturedToEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :events, :featured, :boolean, null: false, default: false
  end
end
