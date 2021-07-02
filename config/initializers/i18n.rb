# frozen_string_literal: true

I18n.default_locale = :en
disabled_locales = ENV["DISABLED_LOCALES"].to_s.split(",").map(&:downcase).map(&:to_sym)
I18n.available_locales = [:en, :de] - disabled_locales
I18n.enforce_available_locales = true

Rails.application.configure do
  config.i18n.fallbacks = [:en] - disabled_locales
end

module I18n
  UNTRANSLATED_SCOPES = ["number", "transliterate", "date", "datetime", "errors", "helpers", "support", "time", "faker"].map { |k| "#{k}." }

  thread_mattr_accessor :debug

  class << self
    alias_method :old_translate, :translate
    def translate(key, options = {})
      key = key.to_s.downcase
      untranslated = UNTRANSLATED_SCOPES.any? { |e| key.include? e }
      key_name = [options[:scope], key].flatten.compact.join(".")
      option_names = options.except(:count, :default, :raise, :scope).map { |k, v| "#{k}=#{v}" }.join(", ")
      return "#{key_name} #{option_names}" if I18n.debug && !untranslated

      options.reverse_merge!(default: old_translate(key, **options.merge(locale: :de))) if untranslated
      old_translate(key, **options)
    end
    alias_method :t, :translate

    def debug?
      debug
    end
  end
end
