# frozen_string_literal: true

class NotificationsController < ApplicationController
  before_action :require_login

  def index
    @notifications = current_user.notifications.reverse_chronologic.limit(20)
    render layout: false
    current_user.notifications.unread.find_each(&:mark_as_read!)
  end
end
