# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :require_login

  def index
    @posts = Post.for_user(current_user).reverse_chronologic.page(params[:page]).per(20)
  end

  def new
    @post = current_user.posts.new
    render layout: false
  end

  def create
    current_user.posts.create! post_params
    close_modal
  end

  def destroy
    @post = authorize Post.find(params[:id])
    @post.destroy!
    redirect_to current_user
  end

  private

  def post_params
    params.require(:post).permit(:description, :location_description, :image)
  end
end
