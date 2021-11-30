# frozen_string_literal: true

module ApplicationHelper
  def show_footer
    @show_footer = true
  end

  def review_status(object)
    @review_object = object
  end
end
