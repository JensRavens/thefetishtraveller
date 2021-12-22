# frozen_string_literal: true

module Feed
  class EventsController < FeedController
    def index
      @events = Event.published.includes(:location)
      @events = @events.joins(:likes).where(likes: {user_id: params[:user_id]}) if params[:user_id].present?
      respond_to :ics
    end
  end
end
