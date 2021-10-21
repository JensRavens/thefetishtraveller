# frozen_string_literal: true

ActiveAdmin.register Title do
  permit_params :location_id, :name, :organisation_name, :country_code

  index do
    selectable_column
    column :name
    column :slug
    column :organisation_name
    column :location
    actions
  end

  show title: :name do

    active_admin_comments
  end

  sidebar "Details", only: :show do
    attributes_table do
      row :slug
      row :organisation_name
      row :country_code
      row :location
    end
  end
end
