# frozen_string_literal: true

class ChatChannel < ApplicationCable::Channel
  class << self
    def on_new_message(message)
      message.conversation.users.each do |user|
        html = ApplicationController.renderer.render(partial: "messages/message", locals: {message: message, current_user: user})
        ActionCable.server.broadcast(id_for(conversation: message.conversation, user: user), {html: html})
      end
    end

    def id_for(conversation:, user:)
      "chat:#{conversation.id}_#{user.slug}"
    end
  end

  delegate :id_for, to: :class

  def subscribed
    conversation = Conversation.find(params[:id])
    stream_from id_for(conversation: conversation, user: current_user)
  end

  def unsubscribed
  end
end
