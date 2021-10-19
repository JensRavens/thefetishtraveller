# == Schema Information
#
# Table name: notifications
#
#  id                :uuid             not null, primary key
#  user_id           :uuid             not null
#  sender_id         :uuid             not null
#  read_at           :datetime
#  notification_type :string
#  subject_type      :string
#  subject_id        :uuid
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Notification < ApplicationRecord
  belongs_to :subject, polymorphic: true
  belongs_to :user
  belongs_to :sender, class_name: "User"

  scope :reverse_chronologic, -> { order(created_at: :desc) }
  scope :unread, -> { where(read_at: nil) }

  class << self
    def notifiy(sender: nil, subject:, user:, type:)
      notification = Notification.create!(sender: sender, subject: subject, user: user, notification_type: type)
      notification.deliver!
    end
  end

  def deliver!
  end

  def read?
    read_at.present?
  end

  def mark_as_read!
    update! read_at: DateTime.current unless read?
  end
end
