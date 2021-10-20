# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit
  include Localizable
  include RemoteNavigation

  skip_forgery_protection
  layout "application"

  def authenticate_admin_user!
    redirect_to root_path unless current_user&.admin?
  end

  def active_admin?
    params[:controller] =~ /^admin\//i
  end

  helper_method :current_user
  def current_user
    @current_user ||= session[:user_id].presence.then { |id| User.find_by(id: id) }
  end

  def message_verifier
    @message_verifier ||= ActiveSupport::MessageVerifier.new(Rails.application.secrets.secret_key_base)
  end

  def require_login
    redirect_to login_path unless current_user
  end

  def require_profile
    require_login
    redirect_to onboarding_path if current_user && !current_user.onboarded?
  end
end
