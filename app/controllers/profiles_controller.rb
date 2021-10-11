# frozen_string_literal: true

class ProfilesController < ApplicationController
  before_action :require_login, only: :show
  before_action :load_profile

  def show
    @travel_plans = @profile.events.listed.load
  end

  def edit
  end

  def update
    @profile.assign_attributes user_params
    if @profile.save context: :profile_edit
      redirect_to profile_path(@profile)
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def load_profile
    @profile = authorize User.friendly.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:slug, :first_name, :last_name, :email, :avatar, :hero, :location_description, :instagram, :recon, :romeo, :bluf)
  end
end
