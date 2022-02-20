# frozen_string_literal: true

module ApplicationHelper
  include Shimmer::FileHelper

  def show_footer
    @show_footer = true
  end

  def edit_bar(object)
    @review_object = object
  end
end
