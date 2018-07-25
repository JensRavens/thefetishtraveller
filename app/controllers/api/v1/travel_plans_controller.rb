module API
  module V1
    class TravelPlansController < APIController
      def show
        user = User.find params[:id]
        events = Event.published.includes(:location).joins(:likes).where(likes: { user: user })
        render json: {
          id: user.id,
          name: user.name,
          event_ids: events.pluck(:id)
        }
      end
    end
  end
end
