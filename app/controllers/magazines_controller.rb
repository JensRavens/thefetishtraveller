# frozen_string_literal: true

class MagazinesController < ApplicationController
  def show
    articles = Article.listed
    articles = articles.tagged_with(params[:filter], on: :article_formats) if params[:filter].present?
    scopes = [paginated(articles)]
    if params[:filter].blank?
      scopes << paginated(Titleholder.listed)
      scopes << paginated(Event.listed)
    end
    @items = scopes.flat_map(&:to_a).sort_by(&:magazine_relevancy)
  end
end
