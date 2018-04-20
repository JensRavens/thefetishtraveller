module API
  module V1
    class APIController < ::APIController
      def current_session
        @current_session ||= Session.find_by id: request.authorization.to_s.split(' ').second
      end

      def current_user
        @current_user ||= current_session&.user
      end

      def require_login
        head :unauthorized unless current_session
      end
    end
  end
end
