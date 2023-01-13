# frozen_string_literal: true

class NotificationMailer < ApplicationMailer
  def notify(user)
    @announcement = Announcement.first
    @notifications = user.notifications.pending
    @user = user
    mail to: user.email
  end
end
