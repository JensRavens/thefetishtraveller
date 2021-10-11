# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :require_login

  def new
    render layout: false
  end

  def create
    current_user.posts.create! post_params
    redirect_to profile_path(current_user)
  end

  private

  def post_params
    params.require(:post).permit(:description, :location_description, :image)
  end
end
