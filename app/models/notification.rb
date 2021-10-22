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
  belongs_to :subject, polymorphic: true, optional: true
  belongs_to :user
  belongs_to :sender, class_name: "User"

  scope :reverse_chronologic, -> { order(created_at: :desc) }
  scope :unread, -> { where(read_at: nil) }

  class << self
    def notify(user:, type:, subject: nil, sender: nil)
      notification = Notification.create!(sender: sender, subject: subject, user: user, notification_type: type)
      notification.deliver!
    end

    def on_liked_post(id:, publisher:)
      post = Post.find id
      notify subject: post, sender: publisher, user: post.user, type: :liked
    end

    def on_commented_post(id:, publisher:)
      post = Post.find id
      notify sender: publisher, user: post.user, subject: post, type: :commented
    end

    def on_followed_user(id:, publisher:)
      user = User.find id
      notify sender: publisher, user: user, type: :followed
    end

    def on_event_created(user_id:, publisher:, notify_admin:)
      return unless notify_admin

      user = User.find user_id
      User.admin.find_each do |admin|
        notify sender: user, user: admin, type: :event_created, subject: publisher
      end
    end

    def on_posted(id:, publisher:)
      post = Post.find id
      publisher.followers.find_each do |user|
        notify sender: publisher, user: user, type: :posted, subject: post
      end
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
