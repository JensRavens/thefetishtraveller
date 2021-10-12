class CreateConversations < ActiveRecord::Migration[6.1]
  def change
    create_table :conversations, id: :uuid do |t|
      t.string :unread_count
      t.string :member_lookup
      t.datetime :last_message_at

      t.timestamps
      t.index :member_lookup, unique: true
    end
  end
end
