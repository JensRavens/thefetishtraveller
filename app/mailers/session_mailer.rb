# frozen_string_literal: true

class SessionMailer < ApplicationMailer
  def login(user)
    @user = user
    @url = login_url(locale: I18n.locale, token: @user.signed_id(expires_in: 1.hour))
    mail to: user.email
  end
end
