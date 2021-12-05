# frozen_string_literal: true

class TitleholdersController < ApplicationController
  def index
    @titleholders = paginated Titleholder.listed.with_attached_picture.includes(:title)
  end

  def show
    @titleholder = Titleholder.listed.friendly.find params[:id]
    @other_titleholders = @titleholder.title.titleholders.listed.with_attached_picture.includes(:title)
  end
end
