module Feed
  class EventsController < FeedController
    def index
      @events = Event.published.includes(:location)
      respond_to :ics
    end
  end
end
