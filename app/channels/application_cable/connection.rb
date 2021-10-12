# frozen_string_literal: true

# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = User.find_by(id: cookies.encrypted["_thefetishtraveller_session"]["user_id"]) || reject_unauthorized_connection
    end
  end
end
