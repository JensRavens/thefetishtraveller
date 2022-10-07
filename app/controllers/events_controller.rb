# frozen_string_literal: true

class EventsController < ApplicationController
  before_action :require_login, only: [:new, :create]

  def index
    @events = Event.listed
    @months = @events.pluck(:start_at)
      .map { |e| [[e.year, e.month].join("-"), e.strftime("%b %y")] }
      .uniq(&:first).sort_by(&:first)
    month = params[:month].presence&.split("-")&.then { |year, m| Date.new(year.to_i, m.to_i, 1) }
    @events = @events.happening_in_month(month) if month
  end

  def show
    @event = Event.friendly.find(params[:id])
    @subevents = @event.events.chronologic
    @other_events = @event.location.events.listed.where.not(id: @event.id)
    @attending_friends = current_user ? current_user.followed_users.attending(@event) : User.none
  end

  def new
    @event = Event.new
  end

  def create
    @event = Event.build_submit event_params.merge(owners: [current_user])
    if @event.save
      redirect_to @event
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @event = authorize Event.friendly.find(params[:id])
  end

  def update
    @event = authorize Event.friendly.find(params[:id])
    if @event.update event_params
      ui.navigate_to @event
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def event_params
    params.require(:event).permit(:name, :location_id, :start_at, :end_at, :abstract, :description, :organizer_name, :ticket_link, :website, :hero, :flyer, :festival, categories: [], gallery_images: [], location_details: [:id, :name, :country_code, :address, :zip, :city, :lat, :lon, :timezone])
  end
end
