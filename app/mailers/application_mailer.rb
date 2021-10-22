# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  helper :assets
  default from: "support@thefetishtraveller.com"
  layout "mailer"
end
