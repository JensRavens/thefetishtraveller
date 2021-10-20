# frozen_string_literal: true

class MessagesController < ApplicationController
  before_action :require_profile
  before_action :assign_conversation

  def index
    @messages = @conversation.messages.order(created_at: :asc).last(100)
  end

  def create
    @conversation.send_message(user: current_user, text: message_params[:text])
    redirect_to profile_messages_path(@profile)
  end

  private

  def message_params
    params.require(:message).permit(:text)
  end

  def assign_conversation
    @profile = User.friendly.find params[:profile_id]
    @conversation = current_user.private_conversation with: @profile
  end
end
