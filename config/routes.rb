# frozen_string_literal: true

require "sidekiq/web"
require "sidekiq-scheduler/web"

Rails.application.routes.draw do
  post "/graphql", to: "graphql#execute"
  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  mount Sidekiq::Web => "/sidekiq" # move to admin once we have admin auth

  namespace :feed do
    resources :events, only: [:index]
  end

  get "sitemaps/*path", to: "pages#sitemap"
  scope "/(:locale)", locale: /#{I18n.available_locales.join("|")}/ do
    ActiveAdmin.routes(self)
    get "login", to: "sessions#new"
    get "logout", to: "sessions#destroy"
    resources :sessions, only: :create
    resources :events, only: [:index, :show, :new, :create]
    resources :travel_plans, only: [:create, :destroy]
    resources :profiles, only: [:show, :edit, :update, :index] do
      get :travel_plans, on: :member
    end
    resources :follows, only: [:create, :destroy]
    resources :likes, only: [:create, :destroy]
    resources :posts, only: [:new, :create, :index, :destroy]
    root "pages#home"
    get "imprint", to: "pages#imprint"
  end

  resources :files, only: :show
end
