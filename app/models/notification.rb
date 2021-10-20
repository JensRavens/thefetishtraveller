# frozen_string_literal: true

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
    def notifiy(subject:, user:, type:, sender: nil)
      notification = Notification.create!(sender: sender, subject: subject, user: user, notification_type: type)
      notification.deliver!
    end
  end

  def deliver!
    title = I18n.t("notifications.notification.type_#{notification_type}", sender: sender.public_name)
    image = ApplicationController.helpers.image_asset_url(subject.image, width: 128) if subject.is_a? Post
    NotificationChannel.broadcast_to(user, title: title, image: image, unread_count: user.unread_notifications_count)
  end

  def read?
    read_at.present?
  end

  def mark_as_read!
    update! read_at: DateTime.current unless read?
  end
end
