# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Localizable

  skip_forgery_protection
  layout "application"

  def current_user
    @current_user ||= ::Session.find_by(id: cookies[:sid])&.user
  end

  def authenticate_admin_user!
    redirect_to root_path unless current_user&.admin?
  end

  def logout
    cookies[:sid] = nil
    redirect_to root_path
  end

  def active_admin?
    params[:controller] =~ /^admin\//i
  end
end
