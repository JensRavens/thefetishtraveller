module API
  module V1
    class APIController < ::APIController
      def current_user
        @current_user ||= User.find_by id: request.authorization.to_s.split(' ').second
      end

      def require_login
        raise :unauthorized unless current_user
      end
    end
  end
end
