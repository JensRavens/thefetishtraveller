# frozen_string_literal: true

require "sidekiq/web"
require "sidekiq-scheduler/web"

Rails.application.routes.draw do
  post "/graphql", to: "graphql#execute"
  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  ActiveAdmin.routes(self)
  mount Sidekiq::Web => "/sidekiq" # move to admin once we have admin auth

  namespace :feed do
    resources :events, only: [:index]
  end

  get "logout", to: "application#logout"
  get "sitemaps/*path", to: "pages#sitemap"
  scope "/(:locale)", locale: /#{I18n.available_locales.join("|")}/ do
    resources :events, only: [:index, :show]
    root "pages#home"
  end
end
