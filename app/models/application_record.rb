# frozen_string_literal: true

require "open-uri"

class ApplicationRecord < ActiveRecord::Base
  include Yael::Publisher

  self.abstract_class = true

  scope :scope_if, ->(scope, condition) { condition ? public_send(scope) : nil }

  class << self
    def required_attributes
      @required_attributes ||= validators
        .select { |e| e.is_a? ActiveModel::Validations::PresenceValidator }
        .flat_map(&:attributes)
        .uniq
    end

    def most_common_tags(limit: 5)
      ActsAsTaggableOn::Tag.where(id: ActsAsTaggableOn::Tagging.where(taggable_type: name).select(:tag_id)).most_used(limit).pluck(:name)
    end
  end

  def audit_events
    @audit_events ||= Yael::Event.where stream: Yael::Event.stream_for(self)
  end
end
