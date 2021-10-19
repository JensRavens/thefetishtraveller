# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "support@thefetishtraveller.com"
  layout "mailer"
end
