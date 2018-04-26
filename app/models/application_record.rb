require "open-uri"

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def attach_from_url(attribute, url)
    public_send(attribute).attach(io: open(url), filename: "hero.jpg", content_type: "image/jpg")
  end
end
