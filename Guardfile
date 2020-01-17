# frozen_string_literal: true

guard :rspec, cmd: "bin/rspec" do
  require "guard/rspec/dsl"
  dsl = Guard::RSpec::Dsl.new(self)

  # RSpec files
  rspec = dsl.rspec
  watch(rspec.spec_files)

  # Ruby files
  ruby = dsl.ruby
  dsl.watch_spec_files_for(ruby.lib_files)

  # Rails files
  rails = dsl.rails(view_extensions: ["erb", "haml", "slim"])
  dsl.watch_spec_files_for(rails.app_files)
  dsl.watch_spec_files_for(rails.views)

  watch(rails.controllers) do |m|
    [
      rspec.spec.call("routing/#{m[1]}_routing"),
      rspec.spec.call("controllers/#{m[1]}_controller"),
      rspec.spec.call("acceptance/#{m[1]}")
    ]
  end

  # Factory Girl
  watch(%r{^spec/factories/.+\.rb}) { "spec/features/factory_girl_spec.rb" }

  watch(%r{^app/controllers/(.+)_(controller)\.rb}) { |m| "spec/requests/#{m[1]}_spec.rb" }
  watch(%r{^app/printers/(.+)_(printer)\.rb}) { |m| "spec/requests/#{m[1]}_spec.rb" }
  watch(%r{^app/forms/(.+)_(form)\.rb}) { |m| "spec/requests/#{m[1]}_spec.rb" }
end
