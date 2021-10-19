# frozen_string_literal: true

module SecureId
  extend ActiveSupport::Concern

  included do
    def secure_id(expires_in: nil)
      self.class.secure_id_message_verifier.generate(id, expires_in: expires_in)
    end
  end

  class_methods do
    def secure_id_message_verifier
      @secure_id_message_verifier ||= ActiveSupport::MessageVerifier.new(Rails.application.secret_key_base)
    end

    def secure_find(token)
      find secure_id_message_verifier.verify token
    end
  end
end
