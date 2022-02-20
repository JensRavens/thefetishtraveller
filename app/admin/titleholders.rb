# frozen_string_literal: true

ActiveAdmin.register Titleholder do
  permit_params :title_id, :user_id, :slug, :full_title, :name, :start_on, :end_on, :url, :abstract, :picture, gallery_images: []

  index do
    selectable_column
    column :full_title
    column :title
    column :user
    column :name
    actions
  end

  sidebar "Details", only: :show do
    div { image_tag titleholder.picture, width: 200 }
  end

  form do |f|
    inputs titleholder.name do
      f.semantic_errors
      input :title, collection: Title.order(name: :asc)
      input :user, collection: User.onboarded.order(slug: :asc).pluck(:slug, :id)
      input :slug unless titleholder.new_record?
      input :full_title
      input :name
      input :start_on, as: :date_picker
      input :end_on, as: :date_picker
      input :url
      input :abstract, as: :text
      input :picture, as: :file, input_html: {accept: "image/*"}
      input :gallery_images, as: :file, input_html: {multiple: true, accept: "image/*"}
    end
    actions
  end
end
