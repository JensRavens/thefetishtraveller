# == Schema Information
#
# Table name: messages
#
#  id              :uuid             not null, primary key
#  text            :string
#  read_at         :datetime
#  type            :string
#  conversation_id :uuid             not null
#  user_id         :uuid             not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user

  after_create_commit do
    ChatChannel.on_new_message(self)
  end

  def unread?
    read_at.nil?
  end

  def read?
    !unread?
  end

  def mark_as_read!
    update! read_at: DateTime.current unless read?
  end
end
