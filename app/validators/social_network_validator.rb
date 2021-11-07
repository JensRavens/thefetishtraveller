# frozen_string_literal: true

class SocialNetworkValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.blank?

    record.errors.add attribute, I18n.t("errors.messages.at_not_allowed"), **options if value.start_with? "@"
    record.errors.add attribute, I18n.t("errors.messages.no_url_allowed"), **options if value.include? "/"
  end
end
