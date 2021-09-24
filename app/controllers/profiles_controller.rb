# frozen_string_literal: true

class ProfilesController < ApplicationController
  before_action :require_login, only: :show

  def show
    @profile = current_user
  end
end
