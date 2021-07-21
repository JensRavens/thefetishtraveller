# frozen_string_literal: true

require "open-uri"

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  scope :scope_if, ->(scope, condition) { condition ? public_send(scope) : nil }
end
