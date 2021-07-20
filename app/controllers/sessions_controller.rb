# frozen_string_literal: true

class SessionsController < ApplicationController
  def new
    redirect_to root_path if current_user
  end

  def create
    name = params[:user] ? JSON.parse(params[:user])["name"] : {}
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    form = {
      grant_type: 'authorization_code',
      code: params[:code],
      client_id: "com.thefetishtraveller.web",
      client_secret: ENV.fetch("APPLE_LOGIN_CLIENT_SECRET"),
      scope: "name email"
    }
    response = HTTParty.post("https://appleid.apple.com/auth/token", body: URI.encode_www_form(form), headers: headers)
    raise StandardError, "Login check failed: #{response.body}" unless response.ok?

    token = JWT.decode(response["id_token"], nil, false).first
    user = User.authenticate_apple id: token["sub"], email: token["email"], first_name: name["firstName"], last_name: name["lastName"]
    session[:user_id] = user.id
    redirect_to root_path
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end
end
