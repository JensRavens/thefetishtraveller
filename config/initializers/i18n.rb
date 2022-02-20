# frozen_string_literal: true

I18n.default_locale = :en
disabled_locales = ENV["DISABLED_LOCALES"].to_s.split(",").map(&:downcase).map(&:to_sym)
I18n.available_locales = [:en, :de] - disabled_locales
I18n.enforce_available_locales = true

Rails.application.configure do
  config.i18n.fallbacks = [:en] - disabled_locales
end
