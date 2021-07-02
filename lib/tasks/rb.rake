# frozen_string_literal: true

namespace :db do
  desc "Downloads the app from heroku to local db"
  task pull: [:environment, :drop] do
    sh "PGUSER=postgres PGHOST=127.0.0.1 PGPORT=54312 heroku pg:pull DATABASE_URL thefetishtraveller_development"
    sh "rails db:environment:set"
    sh "RAILS_ENV=test rails db:create"
  end
end
