# frozen_string_literal: true

ActiveAdmin.register Location do
  permit_params :slug, :name, :country_code, :address, :zip, :city, :lat, :lon, :category, :timezone

  index do
    selectable_column
    column :name
    column :slug
    column :city
    column :country do |location|
      location.country&.name
    end
    column :category do |location|
      location.category&.humanize
    end
    actions
  end

  show do
    attributes_table do
      row :name
      row :address
      row :zip
      row :city
      row :country do
        location.country&.name
      end
      row :coordinates do
        [location.lat, location.lon].compact.join(", ")
      end
      row :category do
        location.category&.humanize
      end
      row :timezone
    end
    active_admin_comments
  end

  sidebar "Details", only: :show do
    attributes_table_for location do
      row :slug
      row :updated_at
      row :created_at
    end
  end

  form do |f|
    inputs location.name do
      f.semantic_errors
      input :name
      input :slug
      input :address
      input :zip
      input :city
      input :country_code, label: "Country", as: :select, collection: Country.all.map { |e| [e.name, e.alpha2.downcase] }.sort_by(&:first), include_blank: false
      input :lat
      input :lon
      input :category, collection: [:region, :city, :hotel, :shop, :bar, :venue].map { |e| [e.to_s.humanize, e] }, include_blank: false
      input :timezone, as: :select, collection: ActiveSupport::TimeZone.all.map { |e| [e.name, e.tzinfo.identifier] }.sort_by(&:first), include_blank: false
    end
    actions
  end
end
