# == Schema Information
#
# Table name: conversation_members
#
#  id              :uuid             not null, primary key
#  conversation_id :uuid             not null
#  user_id         :uuid             not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class ConversationMember < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
end
