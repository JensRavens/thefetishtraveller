# frozen_string_literal: true

ActiveAdmin.register User do
  permit_params :first_name, :last_name, :slug, :visibility, :location_description, :bio, :avatar, :hero, *SocialLink::NETWORKS, roles: []

  index do
    selectable_column
    column :avatar do |row|
      image_tag(row.avatar, width: 80)
    end
    column :public_name
    column :email
    column :location_description
    column :visibility
    actions
  end

  show title: :public_name do
    attributes_table do
      row :name
      row :email
      row :location_description
      row :bio
      row :visibility
      row :roles
    end

    active_admin_comments
  end

  sidebar "Details", only: :show do
    div { image_tag user.avatar, width: 200 }
    attributes_table_for user do
      user.social_links.each do |link|
        row link.network
      end
    end
  end

  form do |f|
    inputs user.public_name do
      f.semantic_errors
      input :first_name
      input :last_name
      input :slug
      input :visibility
      input :location_description
      input :bio, as: :text
      SocialLink::NETWORKS.each do |network|
        input network
      end
      input :avatar
      input :hero
      input :roles, as: :select, collection: [:admin]
    end
    actions
  end
end
