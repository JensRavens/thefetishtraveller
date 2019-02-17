require 'open-uri'

class ApplicationController < ActionController::Base
  layout 'application'

  def webpack_index
    @webpack_index ||= begin
      code = File.read(Rails.root.join('public/index.html'))
    end
  end

  helper_method :webpack_index
end
