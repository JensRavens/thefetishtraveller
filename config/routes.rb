# frozen_string_literal: true

require "sidekiq/web"
require "sidekiq-scheduler/web"

Rails.application.routes.draw do
  post "/graphql", to: "graphql#execute"
  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql" if Rails.env.development?
  ActiveAdmin.routes(self)
  mount Sidekiq::Web => "/sidekiq" # move to admin once we have admin auth
  namespace :api do
    namespace :v1 do
      resources :events, only: [:index, :show, :update, :create] do
        resource :likes, only: [:create, :destroy]
      end
      resources :travel_plans, only: :show
      resources :locations, only: [:index, :show, :update, :create]
      resources :likes, only: :index
      resource :session, only: [:create, :update, :show]
    end
  end

  namespace :feed do
    resources :events, only: [:index]
  end

  get "logout", to: "application#logout"
  get "sitemaps/*path", to: "pages#sitemap"
  get "*path", to: "pages#show", constraints: ->(req) {
    req.path.exclude? "rails/"
  }
  root "pages#show"
end
