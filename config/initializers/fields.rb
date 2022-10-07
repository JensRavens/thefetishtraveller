class LocationField < Shimmer::Form::Field
  self.type = :location

  def wrapper_options
    {data: {controller: "location-select"}}
  end

  def render
    location = builder.object.try(:location)
    options[:name] = ""
    options[:value] ||= location&.name
    options[:data] ||= {}
    options[:data][:location_select_target] = "select"
    fields = builder.fields_for :location_details do |f|
      builder.safe_join [
        f.hidden_field(:id, "data-location-select-target": "id", value: location&.google_id),
        f.hidden_field(:name, "data-location-select-target": "name"),
        f.hidden_field(:country_code, "data-location-select-target": "countryCode"),
        f.hidden_field(:address, "data-location-select-target": "address"),
        f.hidden_field(:zip, "data-location-select-target": "zip"),
        f.hidden_field(:city, "data-location-select-target": "city"),
        f.hidden_field(:lat, "data-location-select-target": "lat"),
        f.hidden_field(:lon, "data-location-select-target": "lon"),
        f.hidden_field(:timezone, "data-location-select-target": "timezone")
      ]
    end
    builder.safe_join [
      fields,
      builder.text_field(method, options)
    ]
  end
end
Shimmer::Form::Builder.register(LocationField)

class RadioField < Shimmer::Form::Field
  self.type = :radio

  def render
    builder.radio_button method, options.delete(:value), options
  end
end
Shimmer::Form::Builder.register(RadioField)
