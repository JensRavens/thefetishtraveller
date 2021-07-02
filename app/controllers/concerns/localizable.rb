# frozen_string_literal: true

module Localizable
  extend ActiveSupport::Concern

  included do
    before_action :set_locale
    before_action :check_locale

    def default_url_options(options = {})
      options = { locale: I18n.locale }.merge options
      options[:debug] = true if I18n.debug?
      options
    end

    def request_locale
      request.env["HTTP_ACCEPT_LANGUAGE"].to_s[0..1].downcase.presence.yield_self { |e| e if I18n.available_locales.include?(e.to_sym) }
    end

    def set_locale
      I18n.locale = url_locale || request_locale || I18n.default_locale
      I18n.debug = params[:debug] == "true"
    end

    def check_locale
      redirect_to url_for(locale: I18n.locale) if !active_admin? && params[:locale].blank? && request.get?
    end

    def url_locale
      params[:locale]
    end
  end
end
