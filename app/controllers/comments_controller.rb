# frozen_string_literal: true

class CommentsController < ApplicationController
  before_action :require_login

  def create
    @post = authorize Post.find(params[:post_id]), :comment?
    @comment = current_user.comment! post: @post, text: comment_params[:text]
    ui.replace @post
  end

  private

  def comment_params
    params.require(:comment).permit(:text)
  end
end
