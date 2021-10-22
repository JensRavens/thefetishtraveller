# frozen_string_literal: true

class DailySummaryJob < ApplicationJob
  def perform
    User.with_pending_notifications.find_each(&:send_daily_notifications!)
  end
end
