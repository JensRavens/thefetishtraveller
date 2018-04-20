module API
  module V1
    class NotAuthorized < StandardError
    end

    class APIController < ::APIController
      rescue_from NotAuthorized, with: :not_authorized

      private

      def current_session
        @current_session ||= Session.find_by id: request.authorization.to_s.split(' ').second
      end

      def current_user
        @current_user ||= current_session&.user
      end

      def require_login
        head :unauthorized unless current_session
      end

      def authorize!(resource)
        if resource.owner_ids.include? current_user&.id
          resource
        else
          raise NotAuthorized
        end
      end

      def not_authorized
        head 403
      end
    end
  end
end
