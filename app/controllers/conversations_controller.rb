# frozen_string_literal: true

class ConversationsController < ApplicationController
  before_action :require_login

  def index
    @conversations = current_user.conversations.with_messages.order(last_message_at: :desc)
  end
end
