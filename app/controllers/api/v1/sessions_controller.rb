module API
  module V1
    class SessionsController < APIController
      before_action :require_login, except: :create

      def create
        user = User.create!
        session = user.sessions.create!
        render json: session
      end

      def show
        render json: current_session
      end

      def update
        email = params.require(:email)
        password = params.require(:password)
        user = User.find_by(email: email)&.authenticate(password)
        if user
          current_user.migrate_to(user)
          current_session.update! user: user
          render json: current_session
        else
          head 422
        end
      end
    end
  end
end
