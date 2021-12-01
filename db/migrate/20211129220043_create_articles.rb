# frozen_string_literal: true

class CreateArticles < ActiveRecord::Migration[6.1]
  def change
    create_table :articles, id: :uuid do |t|
      t.string :slug, null: false, index: { unique: true }
      t.string :title, null: false
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.datetime :publish_at, index: true

      t.timestamps
    end
  end
end
