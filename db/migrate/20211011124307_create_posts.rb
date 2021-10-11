class CreatePosts < ActiveRecord::Migration[6.1]
  def change
    create_table :posts, id: :uuid do |t|
      t.references :author, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.string :location_description
      t.string :description

      t.timestamps
    end
  end
end
