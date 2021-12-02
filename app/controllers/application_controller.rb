# frozen_string_literal: true

require "action_text" # force load action text. for some reason otherwise the view helpers are not there in prod

class ApplicationController < ActionController::Base
  helper ActionText::Engine.helpers
  include Pundit
  include Localizable
  include RemoteNavigation

  skip_forgery_protection
  layout "application"

  unless Rails.env.development?
    rescue_from StandardError do |error|
      raise error unless request.format.turbo_stream?

      close_modal
      replace :main, with: "errors/error", error: error
      default_render
    end
  end

  rescue_from Pundit::NotAuthorizedError do
    raise error if current_user

    redirect_to login_path
  end

  def authenticate_admin_user!
    redirect_to root_path unless current_user&.admin?
  end

  def active_admin?
    params[:controller] =~ /^admin\//i
  end

  helper_method :current_user
  def current_user
    @current_user ||= session[:user_id].presence.then { |id| User.find_by(id: id) }.tap { |user| Sentry.set_user(user ? { username: user.slug } : {}) }
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

  def paginated(scope, per: 10)
    @current_page = params[:page]&.to_i || 1
    scope = scope.page(@current_page).per(per)
    @has_more_pages = !scope.next_page.nil? unless @has_more_pages == true
    if @current_page > 1
      remove "next-page-link"
      append "pagination-frame", with: "components/pagination", items: scope, partial: params[:partial]
    end
    scope
  end
end
