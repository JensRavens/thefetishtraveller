# frozen_string_literal: true

# == Schema Information
#
# Table name: conversations
#
#  id              :uuid             not null, primary key
#  unread_count    :string
#  member_lookup   :string
#  last_message_at :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class Conversation < ApplicationRecord
  has_many :conversation_members, dependent: :destroy
  has_many :users, through: :conversation_members
  has_many :messages, dependent: :destroy

  scope :with_messages, -> { where.not(last_message_at: nil) }

  def send_message(user:, text:)
    message = transaction do
      update! last_message_at: DateTime.current
      messages.create!(text: text, user: user)
    end
    publish :message_sent, on: message, user_id: user.id
  end

  def last_message
    @last_message ||= messages.order(created_at: :desc).first
  end
end
