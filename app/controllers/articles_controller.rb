# frozen_string_literal: true

class ArticlesController < ApplicationController
  before_action :assign_article, only: [:show, :edit, :update]

  def new
    @article = current_user.articles.build
  end

  def create
    @article = current_user.articles.build article_attributes
    if @article.save
      redirect_to @article
    else
      render "edit"
    end
  end

  def show
  end

  def edit
  end

  def update
    if @article.update article_attributes
      redirect_to @article
    else
      render "edit"
    end
  end

  private

  def article_attributes
    params.require(:article).permit(:title, :slug, :publish_at, :content, :hero, :abstract, :hero_background_color, :layout, :listing_layout, :article_format_list)
  end

  def assign_article
    @article = authorize Article.friendly.find params[:id]
  end
end
