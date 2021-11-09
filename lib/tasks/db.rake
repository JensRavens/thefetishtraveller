# frozen_string_literal: true

namespace :db do
  desc "Downloads the app from heroku to local db"
  task pull: [:environment, :drop] do
    ENV["PGUSER"] ||= "postgres"
    ENV["PGHOST"] ||= "127.0.0.1"
    ENV["PGPORT"] ||= "54312"
    sh "heroku pg:pull DATABASE_URL thefetishtraveller_development"
    sh "rails db:environment:set"
    sh "RAILS_ENV=test rails db:create"
  end
end
