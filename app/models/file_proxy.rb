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

  def url(resize: nil, protocol: Rails.env.production? ? :https : :http)
    message = [blob_id, resize]
    Rails.application.routes.url_helpers.file_path(self.class.message_verifier.generate(message), locale: nil, protocol: protocol)
  end
end
