# frozen_string_literal: true

class SessionMailerPreview < ActionMailer::Preview
  def login
    SessionMailer.login(User.onboarded.take!)
  end
end
