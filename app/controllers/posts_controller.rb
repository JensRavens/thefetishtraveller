# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :require_login

  def index
    @posts = Post.reverse_chronologic.page(params[:page]).per(20)
    if params[:tag]
      @posts = @posts.tagged_with params[:tag]
    else
      @posts = @posts.for_user current_user
    end
  end

  def new
    @post = current_user.posts.new
    render layout: false
  end

  def create
    @post = current_user.posts.create! post_params
    close_modal
    prepend :personal_feed, with: @post
  end

  def destroy
    @post = authorize Post.find(params[:id])
    @post.destroy!
    remove(@post)
  end

  def context
    @post = Post.find(params[:id])
    render layout: false
  end

  private

  def post_params
    params.require(:post).permit(:description, :location_description, :image)
  end
end
