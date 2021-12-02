# frozen_string_literal: true

ActiveAdmin.register Article do
  permit_params :location_id, :name, :organisation_name, :country_code

  index do
    selectable_column
    column :title
    column :slug
    column :user
    column :publish_at
    column :published?
    actions
  end

  show title: :title do
    active_admin_comments
  end

  sidebar "Details", only: :show do
    attributes_table do
      row :slug do
        link_to resource.slug, resource
      end
      row :created_at
      row :updated_at
      row :publish_at
      row :published?
    end
  end

  sidebar "Layout", only: :show do
    attributes_table do
      resource.layout_options.each do |key, value|
        row key, value
      end
    end
  end
end
