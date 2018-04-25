class ApplicationSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  def self.image_attribue(name, selector: nil)
    attribute name
    define_method(name) do
      attachment = object.public_send(selector || name)
      return nil unless attachment.attached?
      {
        full: url_for(attachment),
        big: url_for(attachment.variant(resize_to_fit: [1024, 1024])),
        medium: url_for(attachment.variant(resize_to_fit: [512, 512])),
        small: url_for(attachment.variant(resize_to_fit: [256, 256]))
      }
    end
  end

  def default_url_options
    {
      host: ENV['HOST'].presence || "localhost:3000"
    }
  end
end
