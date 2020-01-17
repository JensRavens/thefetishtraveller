# frozen_string_literal: true

module API
  module V1
    class EventsController < APIController
      before_action :require_login, only: [:update, :create]

      def index
        events = Event.all.with_attachments.in_future.includes(:owners)
        events = events.published unless current_user&.admin?
        render json: events, edit_info: true
      end

      def show
        render json: event
      end

      def update
        authorize!(event)
        event.gallery_images.destroy_all if event_params[:gallery_images]
        event.update!(event_params)
        log_activity event, event_params
        render json: event
      end

      def create
        @event = current_user.owned_events.create!(event_params.merge(id: params[:id]))
        log_activity event, event_params
        render json: event
      end

      private

      def event
        @event ||= Event.friendly.find(params[:id])
      end

      def event_params
        p = params.permit(:id, :slug, :name, :start_at, :end_at, :organizer_name, :abstract, :description, :website, :location_id, :location_slug, :series, :event_id, :flyer, :hero, :header, :full_day, categories: [], gallery_images: []).to_h
        p[:location_id] = Location.friendly.find(p.delete(:location_slug)).id if p[:location_slug].present?
        p
      end
    end
  end
end
