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
  end

  def audit_events
    @audit_events ||= Yael::Event.where stream: Yael::Event.stream_for(self)
  end
end
