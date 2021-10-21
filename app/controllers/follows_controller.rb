# frozen_string_literal: true

class FollowsController < ApplicationController
  before_action :require_login

  def create
    user = User.find(params[:user_id])
    current_user.follow!(user: user)
    redirect_to profile_path(user)
  end

  def destroy
    user = User.find(params[:user_id])
    Follow.where(profile: user, user: current_user).delete_all
    redirect_to profile_path(user)
  end
end
