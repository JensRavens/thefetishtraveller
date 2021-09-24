# frozen_string_literal: true

class ProfilesController < ApplicationController
  before_action :require_login, only: :show

  def show
    @profile = current_user
  end

  def edit
    @profile = authorize current_user
  end

  def update
    @profile = authorize current_user
    @profile.assign_attributes user_params
    if @profile.save context: :profile_edit
      redirect_to profile_path(@profile)
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:slug, :first_name, :last_name, :email)
  end
end
