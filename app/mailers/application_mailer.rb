# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  helper Shimmer::FileHelper
  default from: "support@thefetishtraveller.com"
  layout "mailer"
end
