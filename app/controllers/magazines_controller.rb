# frozen_string_literal: true

class MagazinesController < ApplicationController
  def show
    articles = Article.listed.with_attached_hero
    articles = articles.tagged_with(params[:filter], on: :article_formats) if params[:filter].present?
    scopes = [paginated(articles)]
    if params[:filter].blank?
      scopes << paginated(Titleholder.listed.with_attached_picture.includes(:title))
      scopes << paginated(Event.listed.with_attached_hero.includes(:location))
    end
    @items = scopes.flat_map(&:to_a).sort_by(&:magazine_relevancy)
  end
end
