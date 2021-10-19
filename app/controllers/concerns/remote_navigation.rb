# frozen_string_literal: true

module RemoteNavigation
  extend ActiveSupport::Concern

  included do
    def open_modal(path)
      run_javascript "ui.modal.load('#{path}')"
    end

    def close_modal
      run_javascript "ui.modal.close()"
    end

    def run_javascript(script)
      queued_remote_updates.push turbo_stream.append "modal", "<div class='hidden' data-controller='remote-navigation'>#{script}</div>"
    end

    def replace(id, with: nil, **locals)
      queued_remote_updates.push turbo_stream.replace(dashed_dom_id(id), partial: with || id, locals: locals)
    end

    def prepend(id, with: nil, **locals)
      queued_remote_updates.push turbo_stream.prepend(dashed_dom_id(id), partial: with, locals: locals)
    end

    def remove(id)
      queued_remote_updates.push turbo_stream.remove(dashed_dom_id(id))
    end

    def dashed_dom_id(id)
      Array.wrap(id)
        .map { |e| e.is_a?(Symbol) ? e.to_s.dasherize : e }
        .map { |e| e.is_a?(ApplicationRecord) ? helpers.dom_id(e) : e.to_s }
        .join("/")
    end
    helper_method :dashed_dom_id

    private

    def queued_remote_updates
      @queued_remote_updates ||= []
    end

    def default_render
      return super unless @queued_remote_updates&.any?

      render turbo_stream: @queued_remote_updates.join("\n")
    end
  end
end
