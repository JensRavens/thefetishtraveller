# frozen_string_literal: true

class ProfilesController < ApplicationController
  before_action :load_profile, except: :index
  before_action :require_login, only: :index

  def index
    @profiles = User.public_profile.page(params[:page]).per(20)
  end

  def show
    @posts = @profile.posts.reverse_chronologic.limit(20)
  end

  def travel_plans
    @travel_plans = @profile.events.listed
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
    params.require(:user).permit(:slug, :first_name, :last_name, :email, :avatar, :hero, :location_description, :twitter, :instagram, :recon, :romeo, :bluf, :public_profile, :bio)
  end
end
