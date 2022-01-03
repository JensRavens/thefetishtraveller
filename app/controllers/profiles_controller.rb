# frozen_string_literal: true

class ProfilesController < ApplicationController
  before_action :load_profile, except: :index
  before_action :require_profile, only: :index

  def index
    @profiles = User.onboarded.order(created_at: :desc)
    @tag = params[:tag].presence
    @profiles = @profiles.tagged_with(@tag) if @tag
    @profiles = paginated @profiles, per: 23
  end

  def show
    @posts = paginated @profile.posts.reverse_chronologic, per: 20
  end

  def travel_plans
    @travel_plans = @profile.events.listed
  end

  def edit
    @profile.email_preferences = :daily if @profile.email_preferences.nil?
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
    params.require(:user).permit(:slug, :first_name, :last_name, :email, :avatar, :hero, :location_description, :visibility, :bio, :email_preferences, *SocialLink::NETWORKS)
  end
end
