module API
  module V1
    class LikesController < APIController
      before_action :require_login

      def create
        current_user.likes.create! event: event
        render json: { }
      end

      def index
        render json: current_user.likes
      end

      def destroy
        current_user.likes.where(event_id: event).destroy_all
        render json: {}
      end

      private

      def event
        @event ||= Event.friendly.find(params[:event_id])
      end
    end
  end
end
