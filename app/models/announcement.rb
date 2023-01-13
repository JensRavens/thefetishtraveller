class Announcement
  include ActiveModel::Model
  attr_accessor :message

  class << self
    def all
      message = Config.announcement_message.presence
      message ? [Announcement.new(message: message)] : []
    end

    def first
      all.first
    end
  end
end
