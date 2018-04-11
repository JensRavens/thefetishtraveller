module API
  module V1
    class EventsController < APIController
      def index
        render json: Event.published
      end
    end
  end
end
