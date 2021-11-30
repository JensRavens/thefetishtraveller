# frozen_string_literal: true

class MagazinesController < ApplicationController
  def show
    @articles = paginated Article.listed, per: 7
    @titleholders = Titleholder.listed.limit(12)
    @events = Event.listed.limit(8)
  end
end
