module API
  module V1
    class EventsController < APIController
      def index
        render json: Event.published
      end

      def show
        render json: Event.friendly.find(params[:id])
      end
    end
  end
end
