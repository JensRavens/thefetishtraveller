# frozen_string_literal: true

class LikesController < ApplicationController
  before_action :require_login

  def create
    @post = Post.find(params[:post_id])
    @post.likes.create!(user: current_user)
    rerender_post
  end

  def destroy
    @post = Post.find(params[:id])
    @post.likes.where(user: current_user).delete_all
    rerender_post
  end

  private

  def rerender_post
    render turbo_stream: turbo_stream.update(@post, partial: "posts/post", locals: { post: @post })
  end
end
