# frozen_string_literal: true

ActiveSupport.on_load(:action_view) do
  include ActionText::ContentHelper
  include ActionText::TagHelper
end

ActionText::ContentHelper.allowed_tags << "aside"
