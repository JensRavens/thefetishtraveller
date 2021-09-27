# frozen_string_literal: true

class FilesController < ApplicationController
  skip_before_action :check_locale

  def show
    expires_in 1.year, public: true
    request.session_options[:skip] = true # prevents a session cookie from being set (would prevent caching on CDNs)
    blob_id, resize = message_verifier.verified(params[:id]) # blob_id is nil if signature doesn't match => 404 (expected behavior)
    blob = ActiveStorage::Blob.find(blob_id)
    resizeable = resize && !blob.content_type.include?("svg")
    variant = resizeable ? blob.representation(resize: resize).processed : blob
    send_data blob.service.download(variant.key),
              type: blob.content_type,
              disposition: "inline"
  end
end
