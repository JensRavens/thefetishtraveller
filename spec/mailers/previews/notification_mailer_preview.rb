# frozen_string_literal: true

class NotificationMailerPreview < ActionMailer::Preview
  def notify
    NotificationMailer.notify(User.with_pending_notifications.take!)
  end
end
