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
        render json: current_user.owned_events.create!(event_params.merge(id: params[:id]))
      end

      private

      def event
        @event ||= Event.friendly.find(params[:id])
      end

      def event_params
        p = params.permit(:slug, :name, :start_at, :end_at, :organizer_name, :abstract, :description, :website, :location_id, :location_slug, :series, :event_id, :flyer, :hero, :header).to_h
        p[:location_id] = Location.friendly.find(p.delete(:location_slug)).id if p[:location_slug].present?
        p
      end
    end
  end
end
