module API
  module V1
    class EventsController < APIController
      before_action :require_login, only: [:update, :create]

      def index
        events = Event.all
        events = events.published unless current_user&.admin?
        render json: events
      end

      def show
        render json: event
      end

      def update
        authorize!(event).update!(event_params)
        render json: event
      end

      def create
        render json: current_user.owned_locations.create!(event_params.merge(id: params[:id]))
      end

      private

      def event
        @event ||= Event.friendly.find(params[:id])
      end

      def event_params
        p = params.permit(:name, :organizer_name, :website, :location_id).to_h
        p[:location_id] = Location.friendly.find(p[:location_id]).id if p[:location_id].present?
        p
      end
    end
  end
end
