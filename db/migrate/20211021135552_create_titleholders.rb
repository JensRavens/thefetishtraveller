# frozen_string_literal: true

class CreateTitleholders < ActiveRecord::Migration[6.1]
  def change
    create_table :titleholders, id: :uuid do |t|
      t.string :slug, null: false
      t.references :title, null: false, foreign_key: true, type: :uuid
      t.references :user, null: true, foreign_key: true, type: :uuid
      t.string :full_title, null: false
      t.string :name, null: false
      t.date :start_on, null: false
      t.date :end_on
      t.string :url
      t.string :abstract

      t.timestamps
    end
    add_index :titleholders, :slug, unique: true
    add_index :titleholders, :start_on
    add_index :titleholders, :end_on
  end
end
