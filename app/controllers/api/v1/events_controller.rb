module API
  module V1
    class EventsController < APIController
      def index
        render json: Event.published
      end

      def show
        render json: event
      end

      def update
        event.update(event_params)
        render json: event
      end

      private

      def event
        @event ||= Event.friendly.find(params[:id])
      end

      def event_params
        params.permit(:name, :organizer_name, :website)
      end
    end
  end
end
