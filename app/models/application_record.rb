# frozen_string_literal: true

require "open-uri"

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end
