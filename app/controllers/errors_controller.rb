# frozen_string_literal: true

class ErrorsController < ApplicationController
  before_action :capture_exception, except: :offline
  skip_before_action :check_locale, only: :offline

  def not_found
    render status: :not_found
  end

  def unprocessable
    render status: :unprocessable_entity
  end

  def internal_server_error
    render status: :internal_server_error
  end

  def offline
  end

  private

  def exception
    request.env["action_dispatch.exception"]
  end

  def capture_exception
    Sentry.capture_exception(exception)
  end
end
