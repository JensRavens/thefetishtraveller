class PagesController < ApplicationController
  def show
    @path_segments = params[:path].to_s.split('/').last(2)
    @event = Event.published.find_by(slug: @path_segments.second) if @path_segments.size > 1 && @path_segments.first == 'events'
  end
end
