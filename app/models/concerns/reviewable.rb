# frozen_string_literal: true

module Reviewable
  extend ActiveSupport::Concern

  included do
    def pending_review?
      publish_at.nil?
    end

    def published?
      publish_at&.past?
    end

    def publish!
      update! publish_at: DateTime.now
    end
  end
end
