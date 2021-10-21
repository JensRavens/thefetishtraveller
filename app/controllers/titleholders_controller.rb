# frozen_string_literal: true

class TitleholdersController < ApplicationController
  def index
    @titleholders = Titleholder.order(start_on: :desc)
    @titleholders = paginated @titleholders, per: 10
  end

  def show
    @titleholder = Titleholder.friendly.find params[:id]
    @other_titleholders = @titleholder.title.titleholders.order(start_on: :desc)
  end
end
