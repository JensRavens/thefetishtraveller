# frozen_string_literal: true

module API
  module V1
    class NotAuthorized < StandardError
    end

    class APIController < ::APIController
      rescue_from NotAuthorized, with: :not_authorized

      def log_activity(object, modifications = nil, action: action_name)
        Activity.create! user: current_user, action: action, object: object, modifications: modifications || {}
      end

      private

      def current_session
        @current_session ||= Session.find_by id: request.authorization.to_s.split(" ").second
      end

      def current_user
        @current_user ||= current_session&.user
      end

      def require_login
        head :unauthorized unless current_session
      end

      def authorize!(resource)
        return resource if current_user&.admin? || resource.owner_ids.include?(current_user&.id)

        raise NotAuthorized
      end

      def not_authorized
        head :forbidden
      end
    end
  end
end
