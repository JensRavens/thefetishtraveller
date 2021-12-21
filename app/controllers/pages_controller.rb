# frozen_string_literal: true

class PagesController < ApplicationController
  def home
    @events = Event.published.in_future.chronologic.limit(6)
  end

  def imprint
  end
end
