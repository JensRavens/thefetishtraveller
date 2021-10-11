# frozen_string_literal: true

class TravelPlansController < ApplicationController
  def create
    event = Event.find(params[:event_id])
    current_user.travel_plans.create!(event: event)
    redirect_to event
  end

  def destroy
    event = Event.find(params[:event_id])
    current_user.travel_plans.where(event: event).delete_all
    redirect_to event
  end
end
