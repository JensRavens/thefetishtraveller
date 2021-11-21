# frozen_string_literal: true

class OnboardingsController < ApplicationController
  before_action :load_profile

  def show
  end

  def update
    @profile.assign_attributes user_params
    if @profile.save context: :profile_edit
      if @step < 3
        redirect_to onboarding_path(step: @step + 1)
      else
        @profile.onboarding_finished!
        redirect_to profile_path(@profile)
      end
    else
      render "show", status: :unprocessable_entity
    end
  end

  private

  def load_profile
    @profile = current_user
    @step = params[:step].presence&.to_i || 1
  end

  def user_params
    params.require(:user).permit(:slug, :location_description, :avatar, :bio, :visibility, *SocialLink::NETWORKS)
  end
end
