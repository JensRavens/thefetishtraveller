# frozen_string_literal: true

class TravelPlansController < ApplicationController
  def show
    @user = User.find params[:id]
    @events = @user.events.chronologic.scope_if(:in_future, params[:history].nil?).load
  end

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
