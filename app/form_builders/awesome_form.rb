# frozen_string_literal: true

class AwesomeForm < ActionView::Helpers::FormBuilder
  alias_method :original_text_field, :text_field

  delegate :model, to: :form, allow_nil: true

  def text_field(method, options = {})
    prepare_options method, options
    wrap method, super(method, options), "input--string", options
  end

  def text_area(method, options = {})
    prepare_options method, options
    wrap method, super(method, options), "input--string input--text", options
  end

  def image_field(method, options = {})
    prepare_options method, options
    options[:accept] = "image/*"
    wrap method, file_field(method, options), "input--image", options
  end

  def post_image_field(method, options = {})
    prepare_options method, options
    options[:accept] = "image/*"
    options[:data] = {action: "image-preview#change"}
    content = content_tag :div, data: {controller: "image-preview"} do
      safe_join [
        content_tag(:img, "", class: "input__preview", data: {"image-preview_target": "preview"}),
        file_field(method, options)
      ]
    end
    wrap method, content, "input--image input--image-post", options
  end

  def search_field(method, options = {})
    prepare_options method, options
    wrap method, super(method, options), "input--string", options
  end

  def location_field(method, options = {})
    location = object.try(:location)
    prepare_options method, options
    options[:name] = ""
    options[:value] ||= location&.name
    fields = fields_for :location_details do |f|
      safe_join [
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
    wrap method, [
      original_text_field(method, options.merge("data-location-select-target": "select")),
      fields
    ], "input--string", options.merge(controller: "location-select")
  end

  def password_field(method, options = {})
    prepare_options method, options
    wrap method, super(method, options), "input--string", options
  end

  def number_field(method, options = {})
    prepare_options method, options
    wrap method, super(method, options), "input--string", options
  end

  def email_field(method, options = {})
    prepare_options method, options
    wrap method, super(method, options), "input--email", options
  end

  def datetime_field(method, options = {})
    prepare_options method, options
    options[:"data-controller"] = "datepicker"
    wrap method, original_text_field(method, options), "input--datetime", options
  end

  def date_field(method, options = {})
    prepare_options method, options
    options[:"data-controller"] = "datepicker"
    wrap method, super(method, options), "input--date", options
  end

  def check_box(method, options = {})
    prepare_options method, options
    wrap method, super(method, options), "input--checkbox", options
  end

  def collection_select(method, collection, id_method, display_method, options = {})
    prepare_options method, options
    wrap method, super(method, collection, id_method, display_method, options), "input--select", options
  end

  def collection_check_boxes(method, collection, id_method, display_method, options = {})
    prepare_options method, options
    content = super(method, collection, id_method, display_method, options) do |f|
      content_tag(:div, safe_join([f.check_box, f.label]), class: "input input--checkbox")
    end
    wrap method, content, "input--checkboxes", options
  end

  def radio_button(method, value, options = {})
    prepare_options method, options
    options[:label_method] = "#{method}_#{value.to_s.underscore}".to_sym
    wrap method, super(method, value, options), "input--radio", options
  end

  def submit(value = nil, options = {})
    add_classes options, "button"
    super value, options
  end

  private

  def prepare_options(method, options)
    apply_validations method, options
    add_classes options, "input__input"
  end

  def apply_validations(method, options)
    options.reverse_merge! required: true if object.class.try(:required_attributes)&.include?(method)
  end

  def add_classes(options, *classes)
    options[:class] = ([options[:class]] + classes).compact.join(" ")
  end

  def wrap(method, content, classes, options = {})
    classes = Array.wrap(classes).compact
    if object&.errors&.[](method)&.any?
      classes << "input--error"
      errors = safe_join(object.errors[method].map { |e| content_tag :div, e, class: "input__error" })
    end
    label = label(options.delete(:label_method) || method, options.delete(:label_text), class: "input__label")
    label = nil if options[:label] == false
    description = options.delete(:description).presence&.then { |e| content_tag(:div, e, class: "input__description") }
    controller = options.delete(:controller)
    content_tag(:div, safe_join([label, content, description, errors].compact), class: ["input"] + classes, "data-controller": controller)
  end

  def helper
    @template
  end

  delegate :content_tag, :t, :safe_join, :icon, :tag, to: :helper
end
