# frozen_string_literal: true

module Feed
  class FeedController < ApplicationController
    protect_from_forgery with: :null_session
  end
end
