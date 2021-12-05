# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :require_profile, except: :show

  def index
    @posts = Post.reverse_chronologic.with_attached_image.includes(:user, :likes)
    if params[:tag]
      @posts = @posts.tagged_with params[:tag]
    else
      @posts = @posts.for_user current_user
    end
    @posts = paginated @posts, per: 5
  end

  def new
    @post = current_user.posts.new
    render layout: false
  end

  def create
    @post = current_user.post! post_params
    navigate_to @post
  end

  def show
    @post = Post.find params[:id]
    authorize @post.user
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
