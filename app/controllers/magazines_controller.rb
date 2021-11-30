# frozen_string_literal: true

class MagazinesController < ApplicationController
  def show
    articles = paginated Article.listed
    titleholders = paginated Titleholder.listed
    events = paginated Event.listed
    scopes = [articles]
    scopes += [titleholders, events] unless params[:filter] == "articles"
    @items = scopes.flat_map(&:to_a).sort_by(&:magazine_relevancy)
  end
end
