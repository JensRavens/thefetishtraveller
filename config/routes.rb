# frozen_string_literal: true

require "sidekiq/web"
require "sidekiq-scheduler/web"

Rails.application.routes.draw do
  mount ActionCable.server => "/cable"
  post "/graphql", to: "graphql#execute"
  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  mount Sidekiq::Web => "/sidekiq" # move to admin once we have admin auth

  namespace :feed do
    resources :events, only: [:index]
  end

  get "sitemaps/*path", to: "pages#sitemap"
  scope "/(:locale)", locale: /#{I18n.available_locales.join("|")}/ do
    ActiveAdmin.routes(self)
    match "404", to: "errors#not_found", via: :all
    match "422", to: "errors#unprocessable", via: :all
    match "500", to: "errors#internal_server_error", via: :all
    get "login", to: "sessions#new"
    get "logout", to: "sessions#destroy"
    resources :sessions, only: [:create] do
      get "email", on: :collection
    end
    resources :events, only: [:index, :show, :new, :create]
    resources :travel_plans, only: [:create, :destroy]
    resources :profiles, only: [:edit, :index] do
      get :travel_plans, on: :member
      resources :messages, only: [:index, :create]
    end
    resources :conversations, only: :index
    resources :follows, only: [:create, :destroy]
    resources :likes, only: [:create, :destroy]
    resources :posts, only: [:new, :create, :index, :show, :destroy] do
      get "context", on: :member
      resources :comments, only: :create
    end
    resources :articles, only: [:show, :new, :create, :edit, :update]
    resources :titleholders, only: [:index, :show]
    resources :notifications, only: :index
    resource :onboarding, only: [:show, :update]
    resource :manifest, only: :show
    root "pages#home"
    get "imprint", to: "pages#imprint"
    get ":id", to: "profiles#show", as: :profile
    patch ":id", to: "profiles#update"
  end

  resources :files, only: :show
end
