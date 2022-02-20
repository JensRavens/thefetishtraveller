# frozen_string_literal: true

class SearchesController < ApplicationController
  def show
    search = Search.new(term: params[:q]) if params[:q].present?
    ui.replace "search-results", with: "searches/results", search: search
  end
end
