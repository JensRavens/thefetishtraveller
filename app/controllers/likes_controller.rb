# frozen_string_literal: true

class LikesController < ApplicationController
  before_action :require_login
  before_action :assign_post

  def create
    current_user.like! post: @post
    replace @post
  end

  def destroy
    current_user.unlike! post: @post
    replace @post
  end

  private

  def assign_post
    @post = authorize Post.find(params[:post_id].presence || params[:id]), :like?
  end
end
