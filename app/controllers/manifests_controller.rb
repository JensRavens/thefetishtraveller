# frozen_string_literal: true

class ManifestsController < ApplicationController
  def show
    render json: {
      id: "/",
      name: "The Fetish Traveller",
      short_name: "FetishTraveller",
      start_url: "/",
      theme_color: "#191d24",
      display: "standalone",
      background_color: "#191d24",
      icons: [
        {
          src: asset_path("app-icon.png"),
          sizes: "144x144",
          type: "image/png",
          purpose: "any"
        },
        {
          src: asset_path("app-icon.png"),
          sizes: "144x144",
          type: "image/png",
          purpose: "maskable"
        }
      ]
    }
  end

  private

  def helper_proxy
    ActionController::Base.helpers
  end

  delegate :asset_path, to: :helper_proxy
end
