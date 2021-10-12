# frozen_string_literal: true

ActiveAdmin.register User do
  permit_params :first_name, :last_name, :slug, :public_profile, :location_description, :bio, :twitter, :instagram, :recon, :romeo, :bluf, :avatar, :hero, roles: []
  scope :public_profile

  index do
    selectable_column
    column :avatar do |row|
      image_tag(row.avatar, width: 80)
    end
    column :public_name
    column :email
    column :location_description
    column :public_profile
    actions
  end

  show title: :public_name do
    attributes_table do
      row :name
      row :email
      row :location_description
      row :bio
      row :public_profile
      row :roles
    end

    active_admin_comments
  end

  sidebar "Details", only: :show do
    div { image_tag user.avatar, width: 200 }
    attributes_table_for user do
      row :twitter
      row :instagram
      row :recon
      row :romeo
      row :bluf
    end
  end

  form do |f|
    inputs user.public_name do
      f.semantic_errors
      input :first_name
      input :last_name
      input :slug
      input :public_profile
      input :location_description
      input :bio, as: :text
      input :twitter
      input :instagram
      input :recon
      input :romeo
      input :bluf
      input :avatar
      input :hero
      input :roles, as: :select, collection: [:admin]
    end
    actions
  end
end
