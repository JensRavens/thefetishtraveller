# frozen_string_literal: true

class SessionsController < ApplicationController
  skip_forgery_protection only: :apple

  def new
    redirect_to root_path and return if current_user

    finish_email_login if params[:token].present?
  end

  def apple
    session[:user_id] = apple_login.id
  end

  def create
    return if params[:email].blank?

    email_login
    ui.close_modal
    ui.replace "login-area", with: "email_waiting"
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end

  def email
    render layout: false
  end

  private

  def email_login
    user = User.authenticate_email email: params[:email]
    SessionMailer.login(user).deliver_later
  end

  def finish_email_login
    user = User.find_signed! params[:token]
    session[:user_id] = user.id
    redirect_to posts_path
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    @email_login_error = true
    render :new
  end

  def apple_login
    name = params[:user] ? JSON.parse(params[:user])["name"] : {}
    headers = {
      'Content-Type': "application/x-www-form-urlencoded"
    }
    form = {
      grant_type: "authorization_code",
      code: params[:code],
      client_id: "com.thefetishtraveller.web",
      client_secret: ENV.fetch("APPLE_LOGIN_CLIENT_SECRET"),
      scope: "name email"
    }
    response = HTTParty.post("https://appleid.apple.com/auth/token", body: URI.encode_www_form(form), headers: headers)
    raise StandardError, "Login check failed: #{response.body}" unless response.ok?

    token = JWT.decode(response["id_token"], nil, false).first
    User.authenticate_apple id: token["sub"], email: token["email"], first_name: name["firstName"], last_name: name["lastName"]
  end
end
