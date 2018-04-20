module API
  module V1
    class LocationsController < APIController
      def index
        render json: Location.all
      end

      def show
        render json: location
      end

      def update
        location.update!(location_params)
        render json: location
      end

      def create
        render json: current_user.owned_locations.create!(location_params.to_h.merge(id: params[:id]))
      end

      private

      def location
        @location ||= Location.friendly.find(params[:id])
      end

      def location_params
        params.permit(:name, :city, :address, :lat, :lon, :zip, :country_code)
      end
    end
  end
end
