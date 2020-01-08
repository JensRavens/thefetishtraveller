module Types
  class ImageType < Types::BaseObject
    include Rails.application.routes.url_helpers

    field :id, ID, null: false
    field :full, String, null: false 
    field :big, String, null: false 
    field :medium, String, null: false 
    field :small, String, null: false 
    
    
    def full
      url_for(object)
    end
    
    def big
      url_for(object.variant(resize: '1024x1024>'))
    end

    def medium
      url_for(object.variant(resize: '512x512>'))
    end

    def small
      url_for(object.variant(resize: '256x256>'))
    end
  end
end
