ActiveAdmin.register Event do
  permit_params :publish_at, :publish_until, :slug, :location_id, :event_id, :name, :start_at, :end_at, :website, :official, :abstract, :description, :ticket_link, :organizer_name, :series, :full_day, :hero, :header, :flyer, categories: [], gallery_images: []
  scope :published
  scope :in_future, default: true

  member_action :publish, method: :post do
    resource.publish!
    redirect_to resource_path, notice: "Published!"
  end

  action_item :super_action, only: :show, if: ->{ !resource.published? } do
    @event = Event.friendly.find(params[:id])
    link_to 'Publish', publish_admin_event_path(@event), method: :post
  end
  
  index do
    selectable_column
    column :name do |event|
      event.name
    end
    column :location do |event|
      event.location.description
    end
    column :start_at
    column :organizer_name
    column :categories
    column :published do |event|
      status_tag event.published?
    end
    column :pictures do |event|
      status_tag "Hero" if event.hero.attached?
      status_tag "Header" if event.header.attached?
      status_tag "Flyer" if event.flyer.attached?
      status_tag "Gallery" if event.gallery_images.any?
    end
    column :attendance do |event|
      event.likes.size
    end
    actions
  end

  show do
    columns do
      column do
        panel "Hero" do
          image_tag event.hero if event.hero.attached?
        end
      end
      column do
        panel "Header" do
          image_tag event.header if event.header.attached?
        end
      end
    end
    attributes_table do
      row :name
      row :location do
        event.location.description
      end
      row :start_at
      row :end_at
      row :full_day
      row :categories
      row :website
      row :ticket_link
      row :abstract
      row :description
    end
    columns do
      column do
        panel "Flyer" do
          image_tag event.flyer if event.flyer.attached?
        end
      end
      column span: 2 do
        panel "Gallery" do
          div class: "gallery" do
            safe_join(event.gallery_images.map do |image|
              link_to image_tag(image), url_for(image), target: "_blank"
            end, "")
          end
        end
      end
    end
    active_admin_comments
  end

  sidebar "Details", only: :show do
    attributes_table_for event do
      row :slug
      row :series
      row :published do
        status_tag event.published?
      end
      row :publish_at unless event.published?
      row :publish_until if event.published? && event.publish_until?
      row :updated_at
      row :created_at
    end
  end

  form do |f|
    columns do
      column do
        inputs event.name do
          f.semantic_errors
          input :name
          input :location, collection: Location.order(name: :asc).all.map { |e| [e.description, e.id] }
          input :start_at
          input :end_at
          input :full_day
          input :abstract
          input :description
          input :ticket_link
          input :organizer_name
          input :website
          input :official
        end
      end
      column do
        inputs "Publication" do
          input :slug
          input :publish_at
          input :publish_until
          input :series
          input :categories, as: :check_boxes, collection: Event::CATEGORIES.map{|e| [e.humanize, e]}
        end
        inputs "Media" do
          input :hero, as: :file, hint: f.object.hero.attached? ? image_tag(f.object.hero.variant(resize_to_limit: [100, 100])) : nil, input_html: { accept: "image/*" }
          input :header, as: :file, hint: f.object.header.attached? ? image_tag(f.object.header.variant(resize_to_limit: [100, 100])) : nil, input_html: { accept: "image/*" }
          input :flyer, as: :file, hint: f.object.flyer.attached? ? image_tag(f.object.flyer.variant(resize_to_limit: [100, 100])) : nil, input_html: { accept: "image/*" }
          input :gallery_images, as: :file, input_html: { accept: "image/*", multiple: true }
          div class: "gallery" do
            safe_join(event.gallery_images.map do |image|
              link_to image_tag(image), url_for(image), target: "_blank"
            end, "")
          end
        end
      end
    end
    actions
  end
end
