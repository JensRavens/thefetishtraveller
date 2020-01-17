# frozen_string_literal: true

class MovePropertiesToFields < ActiveRecord::Migration[5.2]
  def change
    # locations
    add_column :locations, :name, :string
    add_column :locations, :country_code, :string
    add_column :locations, :address, :string
    add_column :locations, :zip, :string
    add_column :locations, :city, :string
    add_column :locations, :lat, :decimal
    add_column :locations, :lon, :decimal

    # events
    add_column :events, :name, :string
    add_column :events, :start_at, :datetime
    add_column :events, :end_at, :datetime
    add_column :events, :website, :string
    add_column :events, :official, :boolean, null: false, default: false
    add_column :events, :abstract, :text
    add_column :events, :description, :text
    add_column :events, :ticket_link, :string
    add_column :events, :organizer_name, :string
    add_column :events, :categories, :text, array: true, null: false, default: []
    add_column :events, :series, :string

    # move all values
    reversible do |dir|
      dir.up do
        Location.update_all <<-SQL.squish
          name = properties->>'name',
          country_code = properties->>'country_code',
          address = properties->>'adress',
          zip = properties->>'zip',
          city = properties->>'city',
          lat = (properties->>'lat')::decimal,
          lon = (properties->>'lon')::decimal
        SQL

        Event.update_all <<-SQL.squish
          name = properties->>'name',
          start_at = (properties->>'start_at')::timestamp,
          end_at = (properties->>'end_at')::timestamp,
          website = (properties->>'website'),
          official = (properties->>'official')::boolean,
          abstract = (properties->>'abstract'),
          description = (properties->>'description'),
          ticket_link = (properties->>'ticket_link'),
          organizer_name = (properties->>'organizer_name'),
          categories = ARRAY(SELECT jsonb_array_elements_text(properties->'categories'))
        SQL
      end
    end
    change_column_null :locations, :name, false
    change_column_null :locations, :country_code, false

    change_column_null :events, :name, false
    change_column_null :events, :start_at, false
    change_column_null :events, :end_at, false
  end
end
