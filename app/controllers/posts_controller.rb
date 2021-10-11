# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :require_login

  def new
    @post = current_user.posts.new
    render layout: false
  end

  def create
    current_user.posts.create! post_params
    close_modal
  end

  private

  def post_params
    params.require(:post).permit(:description, :location_description, :image)
  end
end
