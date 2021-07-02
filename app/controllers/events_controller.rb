# frozen_string_literal: true

class EventsController < ApplicationController
  def index
    @events = Event.in_future.chronologic
    @months = @events.pluck(:start_at)
      .map { |e| [[e.year, e.month].join("-"), e.strftime("%b %y")] }
      .uniq(&:first).sort_by(&:first)
    month = params[:month].presence&.split("-")&.then { |year, month| Date.new(year.to_i, month.to_i, 1)  }
    @events = @events.happening_in_month(month) if month
  end

  def show
    @event = Event.friendly.find(params[:id])
    @subevents = @event.events
    @other_events = @event.location.events
  end
end
