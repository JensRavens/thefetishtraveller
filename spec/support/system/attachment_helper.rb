# frozen_string_literal: true

module AttachmentHelper
  def attach_file(locator, fixture_name)
    super unless fixture_name.is_a?(String)

    super locator, Rails.root.join(file_fixture(fixture_name))
  end
end

RSpec.configure do |config|
  config.include AttachmentHelper, type: :system
end
