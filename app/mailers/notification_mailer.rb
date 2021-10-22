# frozen_string_literal: true

class NotificationMailer < ApplicationMailer
  def notify(user)
    @notifications = user.notifications.pending
    @user = user
    mail to: user.email
  end
end
