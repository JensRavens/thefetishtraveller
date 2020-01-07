require 'open-uri'

class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true, with: :exception
  layout 'application'

  def webpack_index
    @webpack_index ||= begin
      code = File.read(Rails.root.join('public/index.html'))
    end
  end

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

  helper_method :webpack_index
end
