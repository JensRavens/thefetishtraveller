# frozen_string_literal: true

class MagazinesController < ApplicationController
  def show
    scopes = [paginated(Article.listed)]
    unless params[:filter] == "articles"
      scopes << paginated(Titleholder.listed)
      scopes << paginated(Event.listed)
    end
    @items = scopes.flat_map(&:to_a).sort_by(&:magazine_relevancy)
  end
end
