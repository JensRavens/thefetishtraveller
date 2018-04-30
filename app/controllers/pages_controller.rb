class PagesController < ApplicationController
  def show
    segments = params[:path].to_s.split('/')
    @event = Event.published.find_by(slug: segments.second) if segments.size > 1 && segments.first == 'events'
  end
end
