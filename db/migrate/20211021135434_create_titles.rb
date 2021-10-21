# frozen_string_literal: true

class CreateTitles < ActiveRecord::Migration[6.1]
  def change
    create_table :titles, id: :uuid do |t|
      t.string :slug, null: false
      t.string :name, null: false
      t.string :organisation_name
      t.string :country_code, null: false
      t.references :location, null: true, foreign_key: true, type: :uuid

      t.timestamps
    end
    add_index :titles, :country_code
    add_index :titles, :slug, unique: true
  end
end
