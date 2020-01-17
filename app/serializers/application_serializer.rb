# frozen_string_literal: true

class ApplicationSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  def self.image_attribute(name, selector: nil)
    attribute(name) do
      attachment = object.public_send(selector || name)
      next unless attachment.attached?

      attachment_attributes(attachment)
    end
  end

  def self.image_list_attribute(name, selector: nil)
    attribute(name) do
      attachments = object.public_send(selector || name)
      attachments.map { |e| attachment_attributes(e) }
    end
  end

  def default_url_options
    {
      host: ENV["HOST"].presence || "localhost:3000"
    }
  end

  alias current_user scope

  private

  def attachment_attributes(attachment)
    {
      full: url_for(attachment),
      big: url_for(attachment.variant(resize: "1024x1024>")),
      medium: url_for(attachment.variant(resize: "512x512>")),
      small: url_for(attachment.variant(resize: "256x256>"))
    }
  end
end
