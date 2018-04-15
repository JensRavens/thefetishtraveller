module API
  module V1
    class SessionsController < APIController
      def create
        user = User.create!
        render json: { id: user.id }
      end
    end
  end
end
