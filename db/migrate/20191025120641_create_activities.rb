class CreateActivities < ActiveRecord::Migration[6.0]
  def change
    create_table :activities, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :action, null: false
      t.jsonb :modifications, null: false
      t.uuid :object_id, null: false
      t.string :object_type, null: false

      t.timestamps
    end
  end
end
