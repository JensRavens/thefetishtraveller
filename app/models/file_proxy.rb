# frozen_string_literal: true

class FileProxy
  attr_reader :blob_id

  def initialize(blob_id:)
    @blob_id = blob_id
  end

  class << self
    def message_verifier
      @message_verifier ||= ApplicationController.new.send :message_verifier
    end
  end

  def url(resize: nil, relative: true, protocol: Rails.env.production? ? :https : :http)
    message = [blob_id, resize]
    id = self.class.message_verifier.generate(message)
    if relative
      Rails.application.routes.url_helpers.file_path(id, locale: nil)
    else
      Rails.application.routes.url_helpers.file_url(id, locale: nil, protocol: protocol)
    end
  end
end
